import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
  time?: string;
  attendees?: number;
  category?: string;
}

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsImages, setNewsImages] = useState<{[id:number]:string}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('news').select('*').order('date', { ascending: false });
      if (error || !data) {
        setError(error?.message || "Failed to fetch news");
        setLoading(false);
        return;
      }
      setNews(data);
      // Fetch images in parallel
      const imagePromises = data.map(async (item: NewsItem) => {
        const imagePath = `news_${item.id}_1.png`;
        const { data: imgData } = await supabase.storage.from('news-images').getPublicUrl(imagePath);
        return { id: item.id, url: imgData?.publicUrl ? `${imgData.publicUrl}?t=${Date.now()}` : "/placeholder.svg" };
      });
      const imageResults = await Promise.all(imagePromises);
      const images: {[id:number]:string} = {};
      imageResults.forEach(({id, url}) => { images[id] = url; });
      setNewsImages(images);
      setLoading(false);
    }
    fetchNews();
  }, []);

  return { news, newsImages, loading, error };
}
