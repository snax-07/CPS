'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, GraduationCap, BookOpen, FileText, Loader2, User, Briefcase } from 'lucide-react';
import { studentAPI, type Student } from '@/lib/api-client';
import { toast } from 'sonner';

type PopulatedStudent = Omit<Student, 'user'> & {
  user: {
    _id: string;
    name: string;
    email: string;
  };
};

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<PopulatedStudent | null>(null);
  const [loading, setLoading] = useState(true);

  const studentId = params.id as string;

  useEffect(() => {
    if (studentId) {
      fetchStudentProfile();
    }
  }, [studentId]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getStudentProfileById(studentId);
      setStudent(data as unknown as PopulatedStudent);
    } catch (err) {
      console.error('Failed to fetch student profile:', err);
      toast.error('Failed to load student profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6]" />
          <p className="text-muted-foreground">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </Button>
        <Card className="border-[#e5e5e5]">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-lg">Student profile not found</p>
            <p className="text-sm text-muted-foreground mt-2">
              This student may not have completed their profile yet
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const name = typeof student.user === 'object' ? student.user.name : 'Student';
  const email = typeof student.user === 'object' ? student.user.email : '';

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Applications
      </Button>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">{name}</h1>
            {email && (
              <p className="opacity-90 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {email}
              </p>
            )}
            {student.department && (
              <p className="opacity-90 flex items-center gap-2 mt-1">
                <GraduationCap className="w-4 h-4" />
                {student.department}
                {student.batch && ` • Batch ${student.batch}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Info */}
        <Card className="border-[#e5e5e5]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#8b5cf6]" />
              Academic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-semibold text-foreground">{student.department || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CGPA</p>
              <p className="font-semibold text-foreground">{student.cgpa || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Batch</p>
              <p className="font-semibold text-foreground">{student.batch || 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="border-[#e5e5e5]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#8b5cf6]" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {student.skills && student.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="border-[#8b5cf6]/30 text-[#8b5cf6] bg-[#8b5cf6]/5 px-3 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No skills listed</p>
            )}
          </CardContent>
        </Card>

        {/* Bio & Resume */}
        <Card className="border-[#e5e5e5]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#8b5cf6]" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Bio</p>
              <p className="text-foreground">{student.bio || 'No bio provided'}</p>
            </div>
            {student.resumeUrl && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Resume</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6]/5"
                  onClick={() => window.open(student.resumeUrl, '_blank')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Resume
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
