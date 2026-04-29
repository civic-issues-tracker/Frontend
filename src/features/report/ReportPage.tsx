import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IoLocationSharp, IoCloudUploadOutline, IoCloseCircle } from "react-icons/io5";
import { Button } from '../../components/ui/Button';
import IssueMapPicker from './components/IssueMapPicker';
import { privateApi } from '../../features/auth/services/authService';
import { categoryApi } from '../../features/auth/services/CategorySevice';
import { subcategoryApi } from '../../features/auth/services/subcategoryService';
import { useAuth } from '../../hooks/useAuth';
import { useGeoLocation } from '../../hooks/useGeolocation'; 

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

interface ReportFormData {
  category: string;
  subcategory: string;
  locationName: string;
  lat: number;
  lng: number;
  description: string;
  photo: FileList;
}

const ReportPage: React.FC = () => {
  const { showToast } = useAuth();
  const { location: globalLocation, requestLocation, isLoading: isLocating } = useGeoLocation();
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchingCats, setFetchingCats] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedMapPos, setSelectedMapPos] = useState<{lat: number, lng: number} | null>(null);

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    resetField,
  } = useForm<ReportFormData>();

  const selectedCategoryId = watch("category");
  const photoFile = watch("photo");

  const fetchAddressName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'YegnaFix_App_v1' 
          }
        }
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch  {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const updateLocationData = async (lat: number, lng: number, providedAddress?: string) => {
    setValue("lat", lat);
    setValue("lng", lng);
    setSelectedMapPos({ lat, lng });
    
    const isCoordinateString = /^-?\d+\.\d+/.test(providedAddress || "");
    
    if (providedAddress && !isCoordinateString) {
      setValue("locationName", providedAddress);
    } else {
      setValue("locationName", "Fetching location name...");
      const address = await fetchAddressName(lat, lng);
      setValue("locationName", address);
    }
  };

  useEffect(() => {
    if (globalLocation && !selectedMapPos) {
      updateLocationData(globalLocation.lat, globalLocation.lng, globalLocation.address);
    }
  }, [globalLocation]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [cats, subs] = await Promise.all([
          categoryApi.getAll(),
          subcategoryApi.getAll()
        ]);

        const mergedData: Category[] = cats.map((cat: { id: string; name: string }) => ({
          ...cat,
          subcategories: subs.filter((sub: SubCategory) => 
            String(sub.category_id) === String(cat.id) || String(sub.category) === String(cat.id)
          )
        }));

        setCategories(mergedData);
      } catch (error) {
        console.error("Endpoint sync failed", error);
        setCategories([]);
      } finally {
        setFetchingCats(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (photoFile && photoFile.length > 0) {
      const file = photoFile[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [photoFile]);

  const handleMapClick = (lat: number, lng: number) => {
    updateLocationData(lat, lng);
  };

  const onSubmit = async (data: ReportFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('category_id', data.category);
      formData.append('subcategory_id', data.subcategory);
      formData.append('description', data.description);
      formData.append('latitude', data.lat.toString());
      formData.append('longitude', data.lng.toString());
      if (data.photo?.[0]) formData.append('image', data.photo[0]);

      await privateApi.post('/issues/report/', formData);
      showToast("Report submitted successfully!", "success");
    } catch  {
      showToast("Failed to submit report.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[85vh] px-6 lg:px-20 my-8 md:my-14 animate-in fade-in duration-500">
      
      <div className="w-full lg:w-1/2 bg-tertiary p-6 md:p-10 rounded-[2.5rem] border border-secondary/5 shadow-2xl shadow-secondary/5">
        <header className="mb-10 text-center lg:text-left">
          <h1 className="font-header text-4xl font-black text-secondary tracking-tighter uppercase">
            የኛ<span className="font-light"> Fix</span>
          </h1>
          <p className="font-body text-[10px] text-secondary/40 uppercase tracking-[0.4em] mt-2 font-bold">
            Dynamic Issue Reporting Portal
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-body text-[10px] uppercase tracking-widest font-black text-secondary/40 ml-2">Category</label>
              <select 
                {...register("category", { required: true })}
                className="bg-primary/30 border border-secondary/10 rounded-2xl px-5 py-4 font-body text-sm text-secondary outline-none focus:ring-2 ring-secondary/5 transition-all cursor-pointer"
              >
                <option value="">{fetchingCats ? "Loading..." : "Select Category"}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-body text-[10px] uppercase tracking-widest font-black text-secondary/40 ml-2">Sub-Type</label>
              <select 
                {...register("subcategory", { required: true })}
                disabled={!selectedCategoryId}
                className="bg-primary/30 border border-secondary/10 rounded-2xl px-5 py-4 font-body text-sm text-secondary outline-none focus:ring-2 ring-secondary/5 transition-all disabled:opacity-20 cursor-pointer"
              >
                <option value="">Select Detail</option>
                {categories
                  .find(c => String(c.id) === String(selectedCategoryId))
                  ?.subcategories.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-body text-[10px] uppercase tracking-widest font-black text-secondary/40 ml-2">Location</label>
            <div className="flex gap-2">
              <input 
                {...register("locationName", { required: true })}
                placeholder={isLocating ? "Locating..." : "Click map or GPS icon..."}
                className="flex-1 bg-primary/30 border border-secondary/10 rounded-2xl px-5 py-4 font-body text-sm text-secondary outline-none focus:bg-primary transition-all"
              />
              <button 
                type="button"
                onClick={requestLocation}
                title="Use current location"
                aria-label="Use current location"
                className="bg-secondary text-primary px-5 rounded-2xl hover:scale-95 transition-transform flex items-center justify-center shadow-lg shadow-secondary/10"
              >
                <IoLocationSharp size={20} className={isLocating ? "animate-bounce" : ""} />
              </button>
            </div>
            <input type="hidden" {...register("lat")} />
            <input type="hidden" {...register("lng")} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-body text-[10px] uppercase tracking-widest font-black text-secondary/40 ml-2">Detailed Description</label>
            <textarea 
              {...register("description", { required: true, minLength: 10 })}
              rows={3}
              placeholder="Tell us what's happening..."
              className="w-full bg-primary/30 border border-secondary/10 rounded-2xl px-5 py-4 font-body text-sm text-secondary outline-none focus:bg-primary transition-all resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-body text-[10px] uppercase tracking-widest font-black text-secondary/40 ml-2">Photo Proof</label>
            {previewUrl ? (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-secondary/5">
                <img src={previewUrl} alt="Issue Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => { setPreviewUrl(null); resetField("photo"); }}
                  title="Remove uploaded photo"
                  aria-label="Remove uploaded photo"
                  className="absolute top-3 right-3 text-white bg-black/40 backdrop-blur-md rounded-full p-1"
                >
                  <IoCloseCircle size={22} />
                </button>
              </div>
            ) : (
              <label className="w-full border-2 border-dashed border-secondary/10 rounded-2xl py-12 flex flex-col items-center justify-center gap-3 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-all group">
                <input type="file" className="hidden" {...register("photo")} accept="image/*" />
                <IoCloudUploadOutline size={36} className="text-secondary/20 group-hover:text-secondary/40 transition-colors" />
                <span className="font-body text-[9px] uppercase tracking-[0.3em] font-black text-secondary/30">Upload Photo Evidence</span>
              </label>
            )}
          </div>

          <Button variant="primary" type="submit" isLoading={loading} className="w-full py-5 rounded-2xl text-[11px] uppercase tracking-[0.5em] font-black shadow-2xl">
            Submit Report
          </Button>
        </form>
      </div>

      <div className="w-full lg:w-1/2 min-h-125 bg-secondary/5 rounded-[2.5rem] overflow-hidden border border-secondary/5 relative shadow-inner">
        <div className="absolute top-8 left-8 z-10 bg-tertiary/80 backdrop-blur-xl px-5 py-3 rounded-full border border-secondary/5 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="font-body text-[9px] uppercase tracking-[0.2em] font-black text-secondary underline decoration-red-500">Click Map to Pin Location</p>
          </div>
        </div>
        <IssueMapPicker 
          onLocationSelect={handleMapClick} 
          selectedLocation={selectedMapPos} 
          reports={[]} 
        /> 
      </div>
    </div>
  );
};

export default ReportPage;