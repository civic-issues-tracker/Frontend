import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IoLocationSharp, IoCloudUploadOutline, IoCloseCircle } from "react-icons/io5";
import IssueMapPicker from './components/IssueMapPicker';
import { privateApi } from '../../features/auth/services/authService';
import { subcategoryApi } from '../../features/auth/services/subcategoryService';
import { categoryApi } from '../../features/auth/services/CategorySevice';
import { useAuth } from '../../hooks/useAuth';
import { useGeoLocation } from '../../hooks/useGeolocation';
import { useTranslation } from 'react-i18next'; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const reportSchema = z.object({
  title: z.string().min(3, "report.errors.titleMin"),
  description: z.string().min(10, "report.errors.descriptionMin"),
  location_address: z.string().min(1, "report.errors.locationRequired"),
  location_lat: z.number().refine(val => val !== 0, "report.errors.validLocation"),
  location_long: z.number().refine(val => val !== 0, "report.errors.validLocation"),
  category: z.string().min(1, "report.errors.categoryRequired"),
  subcategory: z.string().optional(),
  images: z.array(z.any()).min(1, "report.toasts.photoProofRequired"),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface SubCategory {
  id: string;
  name: string;
  category_id: string;
  category?: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

const ReportPage: React.FC = () => {
  const { t } = useTranslation(); 
  const { user, showToast } = useAuth();
  const queryClient = useQueryClient();
  const { location: globalLocation, requestLocation, isLoading: isLocating, searchLocations } = useGeoLocation();

  const [previewUrl, setPreviewUrl] = useState<string[]>([]);
  const [selectedMapPos, setSelectedMapPos] = useState<{ lat: number; lng: number } | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTriggeredByClick, setIsTriggeredByClick] = useState(false);

  // Enabled flag prevents firing queries when user session is not ready
  const { data: categories = [], isLoading: fetchingCats } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await categoryApi.getAll();
      return data.map((cat: any) => ({ ...cat }));
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const { data: allSubcategories = [], isLoading: fetchingSubs } = useQuery<SubCategory[]>({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const data = await subcategoryApi.getAll();
      return data.results || data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      location_address: "",
      location_lat: 0,
      location_long: 0,
      category: "",
      subcategory: "",
      images: []
    }
  });

  const locationInput = watch("location_address");
  const selectedCategoryId = watch("category");
  const photoFile = watch("images");

  useEffect(() => {
    setValue("subcategory", "", { shouldValidate: true });
  }, [selectedCategoryId, setValue]);

  const visibleSubcategories = allSubcategories.filter(sub => {
    return String(sub.category) === String(selectedCategoryId) || 
           String(sub.category_id) === String(selectedCategoryId);
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (locationInput && locationInput.length > 2 && !isLocationSelected) {
        const results = await searchLocations(locationInput);
        setSuggestions(results);
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [locationInput, isLocationSelected, searchLocations]);

  // Clean memory management for Blob URLs
  useEffect(() => {
    if (photoFile && photoFile.length > 0) {
      const urls = Array.from(photoFile as File[]).map(file => URL.createObjectURL(file));
      setPreviewUrl(urls);
      return () => {
        urls.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
      setPreviewUrl([]);
    }
  }, [photoFile?.length]);

  const { mutate: submitReport, isPending: loading } = useMutation({
    mutationFn: async (data: ReportFormData) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('location_address', data.location_address);
      formData.append('location_lat', data.location_lat.toString());
      formData.append('location_long', data.location_long.toString());
      formData.append('category_id', data.category);
      if (data.subcategory) {
        formData.append('subcategory_id', data.subcategory);
      }

      if (data.images && data.images.length > 0) {
        const mainFile = data.images[0];
        const mainExt = mainFile.name.split('.').pop() || 'jpg';
        const cleanMainFile = mainFile.name.length > 50 
          ? new File([mainFile], `upload_${Date.now()}_0.${mainExt}`, { type: mainFile.type })
          : mainFile;
        
        formData.append('image', cleanMainFile);

        Array.from(data.images as File[]).slice(1).forEach((file, index) => {
          const ext = file.name.split('.').pop() || 'jpg';
          const cleanFile = file.name.length > 50
            ? new File([file], `upload_${Date.now()}_${index + 1}.${ext}`, { type: file.type })
            : file;
          
          formData.append('extra_images', cleanFile);
        });
      }

      return privateApi.post('/issues/submit/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: [(data) => data]
      });
    },
    onSuccess: () => {
      showToast(t('report.toasts.submitSuccess'), "success");
      queryClient.invalidateQueries({ queryKey: ['recentReports'] });
    },
    onError: () => {
      showToast(t('report.toasts.submitFailed'), "error");
    }
  });

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!isLocationSelected) {
        setValue("location_address", "");
        setValue("location_lat", 0);
        setValue("location_long", 0);
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);
  };

  const handleSelectSuggestion = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const address = item.display_name;

    setIsLocationSelected(true);   
    setValue("location_address", address, { shouldValidate: true, shouldDirty: true });
    setValue("location_lat", lat, { shouldValidate: true });
    setValue("location_long", lon, { shouldValidate: true });
    setSelectedMapPos({ lat, lng: lon });
    setShowDropdown(false);
    setSuggestions([]);
  };

  const fetchAddressName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { 'User-Agent': 'YegnaFix_App_v1' } }
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const updateLocationData = async (lat: number, lng: number, providedAddress?: string) => {
    setValue("location_lat", lat, { shouldValidate: true });
    setValue("location_long", lng, { shouldValidate: true });
    setSelectedMapPos({ lat, lng });
    setIsLocationSelected(true);

    if (providedAddress && !/^-?\d+\.\d+/.test(providedAddress)) {
      setValue("location_address", providedAddress, { shouldValidate: true });
    } else {
      setValue("location_address", t('report.fetchingAddress'));
      const address = await fetchAddressName(lat, lng);
      setValue("location_address", address, { shouldValidate: true });
    }
  };

  const handleGpsClick = async () => {
    setIsTriggeredByClick(true); 
    await requestLocation(); 
  };

  useEffect(() => {
    if (isTriggeredByClick && globalLocation?.lat && globalLocation?.lng) {
      updateLocationData(
        globalLocation.lat, 
        globalLocation.lng, 
        globalLocation.address
      );
      setIsLocationSelected(true);
      setIsTriggeredByClick(false); 
    }
  }, [globalLocation, isTriggeredByClick]);

  const removeImage = (indexToRemove: number) => {
    const currentFiles = Array.from(watch("images") || []);
    const newFiles = currentFiles.filter((_, index) => index !== indexToRemove);
    setValue("images", newFiles, { shouldValidate: true });
  };

  const onSubmit = (data: ReportFormData) => {
    submitReport(data);
  };

  const onInvalidSubmit = (validationErrors: any) => {
    console.warn("⚠️ Validation blockers detected on submission:", validationErrors);
    showToast(t('report.errors.pleaseCorrectErrors'), "error");
  };

  // Clean register handler for location input
  const locationRegister = register("location_address");

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[85vh] px-6 lg:px-20 my-8 md:my-14 animate-in fade-in duration-500">
      <div className="w-full lg:w-1/2 bg-tertiary p-6 md:p-10 rounded-[2.5rem] border border-secondary/5 shadow-2xl shadow-secondary/5">
        <header className="mb-10 text-center lg:text-left">
          <h1 className="font-header text-4xl font-black text-secondary tracking-tighter uppercase">የኛ<span className="font-light"> Fix</span></h1>
          <p className="font-body text-[10px] text-secondary/80 uppercase tracking-[0.4em] mt-2 font-bold">{t('report.subtitle')}</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="font-body text-[10px] uppercase tracking-widest font-black text-secondary ml-2">{t('report.labels.title')}</label>
            <input 
              type="text" 
              {...register("title")} 
              placeholder="Provide a brief summary title for the incident..." 
              className="w-full bg-primary/30 border border-secondary/10 rounded-2xl px-5 py-4 text-sm text-secondary outline-none" 
            />
            {errors.title && <span className="text-[10px] text-red-500 ml-2 uppercase font-bold">{t(errors.title.message || '')}</span>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-body text-[10px] uppercase tracking-widest font-black text-secondary ml-2">{t('report.labels.category')}</label>
              {fetchingCats ? (
                <div className="w-full bg-primary/30 border border-secondary/10 rounded-2xl px-5 py-4 h-13.5 animate-pulse text-secondary/70 font-body text-[14px]">loading categories... </div>
              ) : (
                <select {...register("category")} className="bg-primary/30 border border-secondary/10 rounded-2xl px-5 py-4 text-sm text-secondary outline-none w-full">
                  <option value="" className="text-secondary">{t('report.placeholders.selectCategory')}</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              )}
              {errors.category && <span className="text-[10px] text-red-500 ml-2 uppercase font-bold">{t(errors.category.message || '')}</span>}
            </div>

            <div className="flex flex-col gap-2 flex-1 relative">
              <label className="font-body text-[10px] uppercase tracking-widest font-black text-secondary ml-2">{t('report.labels.subcategory')}</label>
              {fetchingSubs ? (
                <div className="w-full bg-primary/30 border border-secondary/10 rounded-2xl px-5 py-4 h-13.5 animate-pulse text-secondary/70 font-body text-[14px]">loading subcategories... </div>
              ) : (
                <select 
                  {...register("subcategory")} 
                  disabled={!selectedCategoryId} 
                  className="w-full bg-primary/30 border border-secondary/10 rounded-2xl px-5 py-4 text-sm text-secondary outline-none disabled:opacity-20 cursor-pointer appearance-none transition-all focus:border-secondary/30"
                >
                  <option value="">{t('report.placeholders.selectDetail')}</option>
                  {visibleSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.id} className="bg-white text-neutral-800">
                      {sub.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.subcategory && <span className="text-[10px] text-red-500 ml-2 uppercase font-bold">{t(errors.subcategory.message || '')}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="font-body text-[10px] uppercase tracking-widest font-black text-secondary/90 ml-2">{t('report.labels.location')}</label>
            <div className="flex gap-2">
              <input
                ref={locationRegister.ref}
                name={locationRegister.name}
                onBlur={(e) => {
                  locationRegister.onBlur(e);
                  handleInputBlur();
                }}
                onChange={(e) => {
                  setIsLocationSelected(false);
                  locationRegister.onChange(e);
                }}
                placeholder={isLocating ? t('report.placeholders.locating') : t('report.placeholders.locationInput')}
                className="flex-1 bg-primary/30 border border-secondary/10 rounded-2xl px-5 py-4 text-sm text-secondary outline-none"
              />
            </div>
            
            <div className='flex flex-col gap-2 relative'>
              <label className="font-body text-[10px] uppercase tracking-widest font-black text-secondary ml-2">Current Location</label>
              <button type="button" onClick={handleGpsClick} className="bg-primary/30 text-secondary/80 tracking-widest font-black border border-secondary/10 text-[13px] px-5 py-3 rounded-2xl hover:scale-95 transition-transform flex justify-start items-center outline-none"> 
                <IoLocationSharp size={25} className={isLocating ? "animate-bounce" : ""} />
                <p className="text-[13px] pl-2">Click to Use Current Location</p>
              </button>
            </div>
            {errors.location_address && <span className="text-[10px] text-red-500 ml-2 uppercase font-bold">{t(errors.location_address.message || '')}</span>}
            {(errors.location_lat || errors.location_long) && (
              <span className="text-[10px] text-red-500 ml-2 uppercase font-bold">{t('report.errors.validLocation')}</span>
            )}

            {showDropdown && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-tertiary border border-secondary/10 rounded-2xl mt-2 overflow-hidden z-[999] shadow-2xl">
                {suggestions.map((item) => (
                  <li key={item.place_id} onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSuggestion(item);
                  }} className="px-5 py-3 text-xs text-secondary hover:bg-primary cursor-pointer border-b border-secondary/5 last:border-none">
                    {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-body text-[10px] uppercase tracking-widest font-black text-secondary ml-2">{t('report.labels.description')}</label>
            <textarea {...register("description")} rows={3} placeholder={t('report.placeholders.description')} className="w-full bg-primary/70 border border-secondary/10 rounded-2xl px-5 py-4 text-sm text-secondary outline-none resize-none" />
            {errors.description && <span className="text-[10px] text-red-500 ml-2 uppercase font-bold">{t(errors.description.message || '')}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-body text-[10px] uppercase tracking-widest font-black text-secondary ml-2">
              {t('report.labels.photoProof')} {previewUrl.length > 0 && `(${previewUrl.length}/3)`}
            </label>
            <div className="space-y-4">
              {previewUrl.length > 0 && (
                <div className={`grid gap-2 ${previewUrl.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}>
                  {previewUrl.map((url, index) => (
                    <div key={url} className="relative h-32 md:h-44 rounded-2xl overflow-hidden border-2 border-secondary/5 group">
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 text-white bg-red-500/80 rounded-full p-1"><IoCloseCircle size={20} /></button>
                    </div>
                  ))}
                </div>
              )}
              {previewUrl.length < 3 && (
                <label className="w-full border-2 border-dashed border-secondary/10 rounded-2xl py-8 flex flex-col items-center justify-center gap-3 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-all">
                  <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => {
                    const combined = [...Array.from(watch("images") || []), ...Array.from(e.target.files || [])].slice(0, 3);
                    setValue("images", combined, { shouldValidate: true });
                  }} />
                  <IoCloudUploadOutline size={28} className="text-secondary/20" />
                  <span className="font-body text-[9px] uppercase tracking-[0.3em] font-black text-secondary/90">{t('report.placeholders.uploadEvidence')}</span>
                </label>
              )}
              {errors.images && <span className="text-[10px] text-red-500 ml-2 uppercase font-bold block">{t(errors.images.message || '')}</span>}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 rounded-2xl text-[9px] uppercase tracking-[0.5em] font-black shadow-2xl bg-secondary cursor-pointer text-primary hover:scale-[0.99] transition-transform disabled:opacity-50">
            {loading ? t('report.loading') : t('report.buttons.submit')}
          </button>
        </form>
      </div>

      <div className="w-full lg:w-1/2 flex-1 min-h-[400px] md:min-h-[500px] lg:min-h-full bg-secondary/5 rounded-[2.5rem] overflow-hidden border border-secondary/5 relative shadow-inner">
        <div className="absolute top-8 left-8 z-50 bg-tertiary/80 backdrop-blur-xl px-5 py-3 rounded-full border border-secondary/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="font-body text-[9px] uppercase tracking-[0.2em] font-black text-secondary">
              {t('report.mapHint')}
            </p>
          </div>
        </div>

        <div className="absolute inset-0 w-full h-full">
          <IssueMapPicker 
            onLocationSelect={updateLocationData} 
            selectedLocation={selectedMapPos} 
            reports={[]} 
          /> 
        </div>
      </div>
    </div>
  );
};

export default ReportPage;