import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  file?: File;
  url?: string;
}

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  isPublic: boolean;
  currentTrack: number;
  isPlaying: boolean;
}

const Index = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState(0);
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: "1",
      name: "Мой плейлист",
      tracks: [
        {
          id: "1",
          title: "Космическая одиссея",
          artist: "Звёздный путь",
          duration: 240,
        },
        {
          id: "2",
          title: "Галактическая мелодия",
          artist: "Межзвёздные",
          duration: 180,
        },
        {
          id: "3",
          title: "Орбитальная симфония",
          artist: "Планетарий",
          duration: 320,
        },
      ],
      isPublic: true,
      currentTrack: 0,
      isPlaying: false,
    },
  ]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    playlists[0],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [uploadedTracks, setUploadedTracks] = useState<Track[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("audio/")) {
          const newTrack: Track = {
            id: Date.now().toString() + Math.random(),
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Неизвестный исполнитель",
            duration: 0,
            file: file,
            url: URL.createObjectURL(file),
          };
          setUploadedTracks((prev) => [...prev, newTrack]);
        }
      });
    }
  };

  const createPlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name: newPlaylistName,
        tracks: [],
        isPublic: false,
        currentTrack: 0,
        isPlaying: false,
      };
      setPlaylists((prev) => [...prev, newPlaylist]);
      setNewPlaylistName("");
    }
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const joinPlaylist = (playlistId: string) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (playlist && playlist.isPublic) {
      setSelectedPlaylist(playlist);
      if (playlist.tracks[playlist.currentTrack]) {
        playTrack(playlist.tracks[playlist.currentTrack]);
      }
    }
  };

  const sharePlaylist = (playlistId: string) => {
    const shareUrl = `${window.location.origin}/playlist/${playlistId}`;
    navigator.clipboard.writeText(shareUrl);
  };

  const filteredTracks = [
    ...uploadedTracks,
    ...playlists.flatMap((p) => p.tracks),
  ].filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#191414] text-white">
      {/* Header */}
      <header className="bg-[#1DB954] px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Icon name="Music" size={28} />
            MUSIC STREAMING
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Icon
                name="Search"
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Поиск музыки..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-[#1DB954] hover:bg-white/90"
            >
              <Icon name="Upload" size={16} className="mr-2" />
              Загрузить
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-64 bg-[#0F0F0F] p-4 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Icon name="Music" size={20} />
              Библиотека
            </h2>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
              >
                <Icon name="Home" size={16} className="mr-2" />
                Главная
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
              >
                <Icon name="Library" size={16} className="mr-2" />
                Моя музыка
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
              >
                <Icon name="TrendingUp" size={16} className="mr-2" />
                Открытия
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white/70">Плейлисты</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setNewPlaylistName("Новый плейлист")}
                className="text-white/70 hover:text-white"
              >
                <Icon name="Plus" size={16} />
              </Button>
            </div>
            <div className="space-y-1">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center justify-between"
                >
                  <Button
                    variant="ghost"
                    className="flex-1 justify-start text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => setSelectedPlaylist(playlist)}
                  >
                    <Icon name="Music" size={14} className="mr-2" />
                    {playlist.name}
                  </Button>
                  {playlist.isPublic && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => sharePlaylist(playlist.id)}
                      className="text-white/50 hover:text-white"
                    >
                      <Icon name="Share" size={12} />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {newPlaylistName && (
              <div className="mt-2 space-y-2">
                <Input
                  placeholder="Название плейлиста"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={createPlaylist}
                    className="bg-[#1DB954] hover:bg-[#1DB954]/90"
                  >
                    Создать
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setNewPlaylistName("")}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Tabs defaultValue="library" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              <TabsTrigger value="library">Библиотека</TabsTrigger>
              <TabsTrigger value="playlists">Плейлисты</TabsTrigger>
              <TabsTrigger value="social">Социальные</TabsTrigger>
              <TabsTrigger value="search">Поиск</TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTracks.map((track) => (
                  <Card
                    key={track.id}
                    className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-white">
                            {track.title}
                          </h3>
                          <p className="text-sm text-white/70">
                            {track.artist}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => playTrack(track)}
                          className="text-[#1DB954] hover:bg-[#1DB954]/20"
                        >
                          <Icon name="Play" size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="playlists" className="space-y-4">
              {selectedPlaylist && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-white">
                        {selectedPlaylist.name}
                      </span>
                      <div className="flex items-center gap-2">
                        {selectedPlaylist.isPublic && (
                          <Badge className="bg-[#1DB954] text-white">
                            Публичный
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          onClick={() => joinPlaylist(selectedPlaylist.id)}
                          className="bg-[#1DB954] hover:bg-[#1DB954]/90"
                        >
                          <Icon name="Radio" size={16} className="mr-2" />
                          Присоединиться к прослушиванию
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPlaylist.tracks.map((track, index) => (
                        <div
                          key={track.id}
                          className={`flex items-center justify-between p-2 rounded ${
                            index === selectedPlaylist.currentTrack &&
                            selectedPlaylist.isPlaying
                              ? "bg-[#1DB954]/20"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-white/50 w-6">
                              {index + 1}
                            </span>
                            <div>
                              <p className="text-white">{track.title}</p>
                              <p className="text-sm text-white/70">
                                {track.artist}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => playTrack(track)}
                            className="text-white/70 hover:text-white"
                          >
                            <Icon name="Play" size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    Публичные плейлисты
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {playlists
                      .filter((p) => p.isPublic)
                      .map((playlist) => (
                        <div
                          key={playlist.id}
                          className="p-4 bg-white/5 rounded-lg"
                        >
                          <h3 className="font-medium text-white">
                            {playlist.name}
                          </h3>
                          <p className="text-sm text-white/70">
                            {playlist.tracks.length} треков
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              onClick={() => joinPlaylist(playlist.id)}
                              className="bg-[#1DB954] hover:bg-[#1DB954]/90"
                            >
                              <Icon name="Radio" size={16} className="mr-2" />
                              Присоединиться
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => sharePlaylist(playlist.id)}
                              className="text-white/70 hover:text-white"
                            >
                              <Icon name="Share" size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="search" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTracks.map((track) => (
                  <Card
                    key={track.id}
                    className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-white">
                            {track.title}
                          </h3>
                          <p className="text-sm text-white/70">
                            {track.artist}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => playTrack(track)}
                          className="text-[#1DB954] hover:bg-[#1DB954]/20"
                        >
                          <Icon name="Play" size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Player */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1DB954] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon name="Music" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">{currentTrack.title}</h3>
                <p className="text-sm text-white/80">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Icon name="SkipBack" size={20} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlayPause}
                className="text-white hover:bg-white/20"
              >
                <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Icon name="SkipForward" size={20} />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Icon name="Volume2" size={16} className="text-white" />
                <div className="w-24">
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Icon name="MoreHorizontal" size={16} />
              </Button>
            </div>
          </div>

          <div className="mt-2">
            <Progress value={progress} className="h-1 bg-white/20" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
