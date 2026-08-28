import { useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import { Music2, Search, X } from 'lucide-react'
import { MoodBadge } from '@/components/cards/MoodBadge'
import type { Track } from '@/types'

type TrackSearchProps = {
  tracks: Track[]
  selectedTrack: Track | null
  onSelectTrack: (track: Track) => void
  placeholder?: string
}

export function TrackSearch({
  tracks,
  selectedTrack,
  onSelectTrack,
  placeholder = 'Şarkı, sanatçı veya tür ara (örn: The Weeknd, In the End, pop)...',
}: TrackSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fuse.js arama motorunu yapılandır
  const fuse = useMemo(() => {
    return new Fuse(tracks, {
      keys: [
        { name: 'track_name', weight: 0.5 },
        { name: 'artists', weight: 0.3 },
        { name: 'track_genre', weight: 0.1 },
        { name: 'genre_group', weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    })
  }, [tracks])

  // Arama sonuçları
  const results = useMemo(() => {
    if (!query.trim()) {
      return tracks.slice(0, 8)
    }
    return fuse.search(query).map((res) => res.item).slice(0, 8)
  }, [fuse, query, tracks])

  // Dışarı tıklandığında dropdown'ı kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-border/80 bg-card/80 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition backdrop-blur-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Arama Sonuçları Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-border/80 bg-card/95 p-1.5 shadow-2xl backdrop-blur-md">
          {results.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Sonuç bulunamadı. Farklı bir şarkı veya sanatçı adı deneyin.
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {query ? 'Eşleşen Şarkılar' : 'Örnek Şarkılar'}
              </div>
              {results.map((track) => {
                const isSelected = selectedTrack?.id === track.id
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      onSelectTrack(track)
                      setIsOpen(false)
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs transition ${
                      isSelected
                        ? 'bg-primary/15 text-primary'
                        : 'text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Music2
                        className={`size-4 shrink-0 ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      <div className="truncate">
                        <p className="truncate font-semibold">{track.track_name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {track.artists} · <span className="capitalize">{track.track_genre}</span>
                        </p>
                      </div>
                    </div>
                    <MoodBadge mood={track.mood} className="shrink-0 text-[10px]" />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
