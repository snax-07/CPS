'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileCompletenessMeter } from '@/components/profile-completeness-meter';
import { Edit2, Save, Upload, X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { studentAPI, type Student } from '@/lib/api-client';
import { TableSkeletonLoader } from '@/components/loading-skeleton';



export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    skills: [] as string[],
    department: '',
    cgpa: 0,
    batch: '',
    resume: null as File | null,
    resumeUrl: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getProfile();
      setStudentData(data);
      
      // Correctly handle populated user object
      const userObj = typeof data.user === 'object' ? data.user : { name: '', email: '' };
      
      setProfile({
        name: userObj.name || '',
        email: userObj.email || '',
        bio: data.bio || '',
        skills: data.skills || [],
        department: data.department || '',
        cgpa: data.cgpa || 0,
        batch: data.batch || '',
        resume: null,
        resumeUrl: data.resumeUrl || '',
      });
    } catch (err) {
      console.error('[v0] Failed to fetch profile:', err);
      toast.error('Failed to load profile');
      // Set default values on error
      setProfile({
        name: 'Student',
        email: 'student@example.com',
        bio: '',
        skills: [],
        department: '',
        cgpa: 0,
        batch: '',
        resume: null,
        resumeUrl: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const [newSkill, setNewSkill] = useState('');


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(prev => ({
        ...prev,
        resume: file,
      }));
    }
  };

  const calculateProfileCompletion = () => {
    let completion = 0;
    if (profile.name) completion += 20;
    if (profile.department) completion += 20;
    if (profile.skills.length >= 3) completion += 20;
    if (profile.resumeUrl || profile.resume) completion += 20;
    if (profile.bio) completion += 20;
    return completion;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData: any = {
        bio: profile.bio,
        skills: profile.skills,
        department: profile.department,
        cgpa: profile.cgpa,
        batch: profile.batch,
      };

      await studentAPI.updateProfile(updateData);

      // Upload resume if new one was selected
      if (profile.resume) {
        await studentAPI.uploadResume(profile.resume);
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      await fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('[v0] Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">My Profile</h1>
        <TableSkeletonLoader rows={3} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Profile Completeness Meter */}
      <ProfileCompletenessMeter percentage={calculateProfileCompletion()} variant="premium" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your profile and resume information</p>
        </div>
        <Button
          onClick={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
          disabled={saving || loading}
          className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:opacity-90 text-white gap-2 disabled:opacity-50"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 border-[#e5e5e5]">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
        </TabsList>

        {/* Personal Tab */}
        <TabsContent value="personal">
          <Card className="border-[#e5e5e5]">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your basic profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-[#e5e5e5]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center text-white text-2xl font-bold">
                  {profile.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm" className="border-[#8b5cf6] text-[#8b5cf6]">
                    Change Photo
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name (Read-only)
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    disabled={true}
                    className="mt-2 border-[#e5e5e5] bg-[#f5f5f3]"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address (Read-only)
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    disabled={true}
                    className="mt-2 border-[#e5e5e5] bg-[#f5f5f3]"
                  />
                </div>

                <div>
                  <Label htmlFor="department" className="text-sm font-medium">
                    Department
                  </Label>
                  <Input
                    id="department"
                    name="department"
                    value={profile.department}
                    placeholder="e.g. Computer Science"
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-2 border-[#e5e5e5] focus-visible:ring-[#8b5cf6]"
                  />
                </div>

                <div>
                  <Label htmlFor="batch" className="text-sm font-medium">
                    Batch / Graduation Year
                  </Label>
                  <Input
                    id="batch"
                    name="batch"
                    value={profile.batch}
                    placeholder="e.g. 2024"
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-2 border-[#e5e5e5] focus-visible:ring-[#8b5cf6]"
                  />
                </div>

                <div>
                  <Label htmlFor="cgpa" className="text-sm font-medium">
                    Current CGPA
                  </Label>
                  <Input
                    id="cgpa"
                    name="cgpa"
                    type="number"
                    step="0.01"
                    value={profile.cgpa}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-2 border-[#e5e5e5] focus-visible:ring-[#8b5cf6]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="mt-2 w-full px-3 py-2 border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] disabled:bg-[#f5f5f3]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card className="border-[#e5e5e5]">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Showcase your technical and professional skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill (e.g., React)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    className="border-[#e5e5e5] focus-visible:ring-[#8b5cf6]"
                  />
                  <Button
                    onClick={handleAddSkill}
                    className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:opacity-90 text-white gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {profile.skills.map(skill => (
                  <div
                    key={skill}
                    className="px-4 py-2 bg-gradient-to-r from-[#8b5cf6]/10 to-[#7c3aed]/10 border border-[#8b5cf6]/20 rounded-full flex items-center gap-2 group"
                  >
                    <span className="font-medium text-[#8b5cf6]">{skill}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-[#8b5cf6] hover:text-red-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resume Tab */}
        <TabsContent value="resume">
          <Card className="border-[#e5e5e5]">
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Upload or update your resume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-8 border-2 border-dashed border-[#e5e5e5] rounded-lg text-center hover:border-[#8b5cf6] transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold mb-1">Upload your resume</p>
                <p className="text-sm text-muted-foreground mb-4">PDF, DOC, or DOCX • Max 5MB</p>
                {isEditing ? (
                  <>
                    <label className="inline-block">
                      <Button className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:opacity-90 text-white">
                        Choose File
                      </Button>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>
                  </>
                ) : (
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-[#8b5cf6] text-[#8b5cf6]">
                      Download Resume
                    </Button>
                  </a>
                )}
              </div>

              {profile.resume && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-semibold text-green-700">✓ {profile.resume.name}</p>
                  <p className="text-sm text-green-600 mt-1">Ready to be uploaded</p>
                </div>
              )}

              {!profile.resume && (
                <div className="p-4 bg-[#f5f5f3] border border-[#e5e5e5] rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Current Resume:</span> resume.pdf
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Uploaded on March 1, 2024</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
