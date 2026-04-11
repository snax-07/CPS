'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Search, Filter, Briefcase, MapPin, Zap } from 'lucide-react';
import { jobAPI, type Job } from '@/lib/api-client';
import { toast } from 'sonner';

export default function PlacementsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobAPI.getAllJobs();
      setJobs(data);
    } catch (err) {
      toast.error('Failed to load placements');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !filterLocation || job.location.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <h1 className="text-3xl font-bold">Browse Placements</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
           {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header stays visible always */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Placements & Internships</h1>
        <p className="text-muted-foreground">Browse and apply to exciting opportunities</p>
      </div>

      {/* Search and Filter stays visible always */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by company or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#e5e5e5] focus-visible:ring-[#8b5cf6]"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Filter by location..."
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="pl-10 border-[#e5e5e5] focus-visible:ring-[#8b5cf6]"
          />
        </div>
      </div>

      {/* Conditional Rendering: Only the content area changes */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Link key={job._id} href={`/placements/${job._id}`}>
              <Card className="border-[#e5e5e5] hover:shadow-lg hover:border-[#8b5cf6]/30 transition-all cursor-pointer h-full flex flex-col">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center text-white text-sm font-bold mb-2">
                    {job.company.charAt(0).toUpperCase()}
                  </div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription>{job.company}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-3">
                  <div className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" />{job.location}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2"><Zap className="w-4 h-4" />{job.salary}</div>
                  <p className="text-sm line-clamp-2">{job.description}</p>
                  <Button className="w-full mt-auto bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white">View Details</Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty state within the layout */
        <Card className="border-[#e5e5e5] border-dashed bg-gray-50/50 py-16">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="max-w-xs">
              <p className="font-semibold text-lg">No matches found</p>
              <p className="text-sm text-muted-foreground">Adjust your search query or location filter to find more opportunities.</p>
            </div>
            <Button variant="outline" onClick={() => {setSearchQuery(''); setFilterLocation('');}} className="border-[#8b5cf6] text-[#8b5cf6]">
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}