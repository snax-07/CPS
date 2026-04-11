'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MapPin, Globe, Briefcase, Users, Edit2, Save, X } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { companyAPI } from '@/lib/api-client';

interface CompanyProfile {
  _id: string;
  companyName: string;
  contactEmail: string;
  website: string;
  location: string;
  industry: string;
  description: string;
  logo?: string;
}

interface CompanyStats {
  activeJobs: number;
  totalApplicants: number;
  shortlisted: number;
  profileViews: number;
}

export default function CompanyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [editData, setEditData] = useState<any | null>(null);
  const [stats, setStats] = useState<CompanyStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?._id) {
          const [profileData, statsData] = await Promise.all([
            companyAPI.getCompanyProfile(user._id),
            companyAPI.getStats()
          ]);
          setProfile(profileData as any);
          setEditData(profileData);
          setStats(statsData);
        }
      } catch (error) {
        console.error("Failed to fetch company profile/stats:", error);
      }
    };
    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (editData) {
      const updatedData = await companyAPI.updateCompanyProfile(editData);
      setProfile(updatedData as any);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Company Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your company information and branding</p>
        </div>
        {!isEditing && (
          <Button
            className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:shadow-lg"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Banner */}
      <Card className="border-[#e5e5e5]">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Your public company profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isEditing ? (
            <>
              {/* Company Logo and Name */}
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center text-white text-4xl font-bold">
                  {profile.companyName?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{profile.companyName}</h2>
                  <p className="text-muted-foreground text-sm mt-1">{profile.industry}</p>
                  <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {profile.companySize}
                  </p>
                </div>
              </div>

              {/* Company Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <Label className="text-sm text-muted-foreground">Contact Email</Label>
                  <div className="flex items-center gap-2 mt-2 text-foreground font-medium">
                    <Mail className="w-4 h-4 text-[#8b5cf6]" />
                    {profile.contactEmail}
                  </div>
                </div>

                {/* Website */}
                <div>
                  <Label className="text-sm text-muted-foreground">Website</Label>
                  <div className="flex items-center gap-2 mt-2 text-foreground font-medium">
                    <Globe className="w-4 h-4 text-[#8b5cf6]" />
                    <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="text-[#8b5cf6] hover:underline">
                      {profile.website}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label className="text-sm text-muted-foreground">Location</Label>
                  <div className="flex items-center gap-2 mt-2 text-foreground font-medium">
                    <MapPin className="w-4 h-4 text-[#8b5cf6]" />
                    {profile.location}
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <Label className="text-sm text-muted-foreground">Industry</Label>
                  <div className="flex items-center gap-2 mt-2 text-foreground font-medium">
                    <Briefcase className="w-4 h-4 text-[#8b5cf6]" />
                    {profile.industry}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm text-muted-foreground">Company Description</Label>
                <p className="text-foreground mt-2 leading-relaxed">{profile.description}</p>
              </div>
            </>
          ) : (
            <>
              {/* Edit Mode */}
              <div className="space-y-6">
                {/* Company Name */}
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={editData?.companyName}
                    onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                    className="mt-2 border-[#e5e5e5]"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={editData?.contactEmail}
                    onChange={(e) => setEditData({ ...editData, contactEmail: e.target.value })}
                    className="mt-2 border-[#e5e5e5]"
                  />
                </div>

                {/* Website */}
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={editData?.website}
                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                    className="mt-2 border-[#e5e5e5]"
                  />
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editData?.location}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="mt-2 border-[#e5e5e5]"
                  />
                </div>

                {/* Industry */}
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={editData?.industry}
                    onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                    className="mt-2 border-[#e5e5e5]"
                  />
                </div>



                {/* Description */}
                <div>
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    value={editData?.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="mt-2 border-[#e5e5e5] min-h-[150px]"
                  />
                </div>

                {/* Save/Cancel Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:shadow-lg"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#e5e5e5] hover:bg-[#f5f5f3]"
                    onClick={handleCancel}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Billing & Verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-[#e5e5e5]">
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Your company verification progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-[#e5e5e5] rounded-lg">
              <span className="text-sm text-foreground">Email Verified</span>
              <span className="text-green-600 font-semibold">✓ Verified</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#e5e5e5] rounded-lg">
              <span className="text-sm text-foreground">Company Details</span>
              <span className="text-green-600 font-semibold">✓ Verified</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#e5e5e5] rounded-lg">
              <span className="text-sm text-foreground">Tax ID</span>
              <span className="text-yellow-600 font-semibold">⏳ Pending</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e5e5]">
          <CardHeader>
            <CardTitle>Account Stats</CardTitle>
            <CardDescription>Your account overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-[#e5e5e5] rounded-lg">
              <span className="text-sm text-foreground">Active Jobs</span>
              <span className="text-2xl font-bold text-[#8b5cf6]">{stats?.activeJobs || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#e5e5e5] rounded-lg">
              <span className="text-sm text-foreground">Total Applications</span>
              <span className="text-2xl font-bold text-[#8b5cf6]">{stats?.totalApplicants || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#e5e5e5] rounded-lg">
              <span className="text-sm text-foreground">Shortlisted</span>
              <span className="text-2xl font-bold text-[#8b5cf6]">{stats?.shortlisted || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
