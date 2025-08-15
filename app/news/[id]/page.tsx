"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabaseClient'

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const newsId = params.id as string
  const [currentNews, setCurrentNews] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [relatedNews, setRelatedNews] = useState<any[]>([])

  useEffect(() => {
    window.scrollTo(0, 0)
    const fetchNews = async () => {
      setIsLoading(true)
      // Fetch news detail
      const [{ data, error }, now] = await Promise.all([
        supabase
          .from('news')
          .select('*')
          .eq('id', newsId)
          .single(),
        Promise.resolve(Date.now())
      ])
      if (error || !data) {
        router.push('/news')
        setIsLoading(false)
        return
      }

      // Ambil daftar file image yang benar-benar ada di bucket
      const { data: bucketFiles, error: bucketError } = await supabase.storage.from('news-images').list('', { search: `news_${newsId}_` })
      let images: string[] = []
      if (!bucketError && Array.isArray(bucketFiles) && bucketFiles.length > 0) {
        const filteredFiles = bucketFiles.filter(f => f.name.startsWith(`news_${newsId}_`) && (f.name.endsWith('.jpg') || f.name.endsWith('.png')));
        // PARALLEL getPublicUrl
        const imageUrlResults = await Promise.all(
          filteredFiles.map(f => supabase.storage.from('news-images').getPublicUrl(f.name))
        );
        images = imageUrlResults.map((img, idx) => img.data?.publicUrl ? `${img.data.publicUrl}?t=${now}` : '/placeholder.svg');
      }
      if (images.length === 0) images = ['/placeholder.svg']

      // Fetch related news: category sama, id berbeda
      const { data: related, error: relError } = await supabase
        .from('news')
        .select('*')
        .eq('category', data.category)
        .neq('id', data.id)

      let relatedWithImages: any[] = []
      if (!relError && Array.isArray(related)) {
        // Fetch images for each related news in parallel
        relatedWithImages = await Promise.all(related.map(async (item: any) => {
          const { data: relBucketFiles, error: relBucketError } = await supabase.storage.from('news-images').list('', { search: `news_${item.id}_` });
          let relImages: string[] = [];
          const relNow = now;
          if (!relBucketError && Array.isArray(relBucketFiles) && relBucketFiles.length > 0) {
            const relFilteredFiles = relBucketFiles.filter(f => f.name.startsWith(`news_${item.id}_`) && (f.name.endsWith('.jpg') || f.name.endsWith('.png')));
            // PARALLEL getPublicUrl
            const relImageUrlResults = await Promise.all(
              relFilteredFiles.map(f => supabase.storage.from('news-images').getPublicUrl(f.name))
            );
            relImages = relImageUrlResults.map((img, idx) => img.data?.publicUrl ? `${img.data.publicUrl}?t=${relNow}` : '/placeholder.svg');
          }
          if (relImages.length === 0) relImages = ['/placeholder.svg'];
          return { ...item, images: relImages };
        }));
      }

      // Update state sekali setelah semua data siap
      setCurrentNews({ ...data, images })
      setRelatedNews(relatedWithImages)
      setIsLoading(false)
    }
    fetchNews()
  }, [newsId, router])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const nextImage = () => {
    if (currentNews && currentNews.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % currentNews.images.length)
    }
  }

  const prevImage = () => {
    if (currentNews && currentNews.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + currentNews.images.length) % currentNews.images.length)
    }
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
          <div className="h-64 bg-muted rounded w-full max-w-3xl mt-8"></div>
        </div>
      </div>
    )
  }

  if (!currentNews) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">News Not Found</h1>
        <p className="text-muted-foreground mb-6">The news you are looking for does not exist or has been removed.</p>
        <Link href="/news">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      {/* Back button */}
      <div className="mb-8">
        <Link href="/news">
          <Button variant="ghost" className="group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to News
          </Button>
        </Link>
      </div>

      {/* News Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">{currentNews.title}</h1>
        <div className="flex flex-wrap gap-4 items-center text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{formatDate(currentNews.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{currentNews.time}</span>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {currentNews.category}
          </Badge>
        </div>
      </div>

      {/* Image Slideshow */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] mb-8 overflow-hidden rounded-lg">
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {currentNews.images && currentNews.images.map((image: string, index: number) => (
            <div key={index} className="min-w-full h-full relative" onContextMenu={e => e.preventDefault()}>
              <Image
                src={image || "/placeholder.svg"}
                alt={`${currentNews.title} - Image ${index + 1}`}
                fill
                className="object-cover w-full h-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                style={{ objectFit: 'cover' }}
                onContextMenu={e => e.preventDefault()}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm z-10"
          onClick={prevImage}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous image</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm z-10"
          onClick={nextImage}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next image</span>
        </Button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {currentNews.images && currentNews.images.map((_: string, index: number) => (
            <button
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                currentImageIndex === index ? "bg-primary w-5" : "bg-background/80 backdrop-blur-sm",
              )}
              onClick={() => setCurrentImageIndex(index)}
            >
              <span className="sr-only">Image {index + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* News Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentNews.description }}></div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* News Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Location</h3>
                <p className="text-muted-foreground">{currentNews.location}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Organizer</h3>
                <p className="text-muted-foreground">{currentNews.organizer}</p>
              </div>
              <Separator />
              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Related News</h3>
                <div className="space-y-4">
                  {relatedNews.map((related: any) => (
                    <Link href={`/news/${related.id}`} key={related.id}>
                      <div className="flex items-start gap-3 p-3 rounded-md hover:bg-muted transition-colors">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0" onContextMenu={e => e.preventDefault()}>
                          <Image
                            src={related.images[0] || "/placeholder.svg"}
                            alt={related.title}
                            fill
                            className="object-cover"
                            onContextMenu={e => e.preventDefault()}
                            draggable={false}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium line-clamp-1">{related.title}</h4>
                          <p className="text-sm text-muted-foreground">{formatDate(related.date)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
