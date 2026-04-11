'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Users, Target, CheckCircle, MessageCircle, BarChart3 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f5f5f3] via-[#fafaf8] to-[#f0f0ed] overflow-hidden">
      {/* Animated gradient bg */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#8b5cf6]/20 to-[#7c3aed]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-gradient-to-r from-[#a78bfa]/20 to-[#8b5cf6]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 sm:px-12 sm:py-5 backdrop-blur-xl bg-white/30 border-b border-[#e5e5e5]/40">
        <div className="text-2xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] bg-clip-text text-transparent">
          Snax Hub
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-[#e5e5e5] hover:bg-white/50 backdrop-blur-sm"
            onClick={() => router.push('/login')}
          >
            Login
          </Button>
          <Button 
            className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:shadow-lg hover:shadow-[#8b5cf6]/30 text-white transition-all"
            onClick={() => router.push('/signup')}
          >
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 sm:px-12 sm:py-32 lg:py-48">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-block">
                  <div className="px-4 py-2 rounded-full border border-[#8b5cf6]/40 bg-gradient-to-r from-[#8b5cf6]/10 to-[#7c3aed]/10 backdrop-blur-sm">
                    <p className="text-sm font-semibold bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] bg-clip-text text-transparent">
                      ✨ Revolutionizing Campus Placements
                    </p>
                  </div>
                </div>
                <h1 className="text-6xl sm:text-7xl font-bold text-foreground leading-tight text-balance">
                  Land Your
                  <span className="block bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#8b5cf6] bg-clip-text text-transparent">
                    Dream Role
                  </span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Connect with top companies, build your professional brand, and discover opportunities that align with your goals. All in one powerful platform.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:shadow-2xl hover:shadow-[#8b5cf6]/40 text-white text-base h-14 font-semibold transition-all"
                  onClick={() => router.push('/signup?role=student')}
                >
                  Get Started as Student
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg"
                  className="border-2 border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6]/10 text-base h-14 font-semibold transition-all"
                  onClick={() => router.push('/signup?role=company')}
                >
                  Post a Job
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>

              {/* Social Proof */}
              <div className="pt-8 border-t border-[#e5e5e5]/50">
                <p className="text-sm text-muted-foreground mb-4">Trusted by students from</p>
                <div className="flex flex-wrap gap-6 items-center">
                  {['IIT', 'BITS', 'NIT', 'IIIT', 'Top 50'].map((college, idx) => (
                    <div key={idx} className="text-sm font-semibold text-foreground/70">
                      {college}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Visual - Interactive Card */}
            <div className="relative hidden lg:block h-full min-h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/30 to-[#7c3aed]/30 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-[#e5e5e5]/50 hover:shadow-3xl transition-all duration-300">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]"></div>
                    <div>
                      <p className="font-semibold text-foreground">Google</p>
                      <p className="text-xs text-muted-foreground">Product Manager</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    Live
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-[#8b5cf6]/10 to-[#7c3aed]/10 border border-[#8b5cf6]/20">
                      <p className="text-2xl font-bold text-foreground">₹18L</p>
                      <p className="text-xs text-muted-foreground mt-1">Base Salary</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-[#8b5cf6]/10 to-[#7c3aed]/10 border border-[#8b5cf6]/20">
                      <p className="text-2xl font-bold text-foreground">10</p>
                      <p className="text-xs text-muted-foreground mt-1">Positions</p>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-3 pt-4 border-t border-[#e5e5e5]">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-[#8b5cf6]" />
                      <span className="text-sm text-foreground">5+ years experience</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-[#8b5cf6]" />
                      <span className="text-sm text-foreground">Engineering background</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-[#8b5cf6]" />
                      <span className="text-sm text-foreground">Mumbai, Delhi, Bangalore</span>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <Button className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white h-12 font-semibold mt-4 hover:shadow-lg">
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6 sm:px-12 bg-gradient-to-b from-transparent via-white/40 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to succeed in your placement journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Smart Matching',
                description: 'AI-powered recommendations that connect you with opportunities matching your skills and goals.',
              },
              {
                icon: Users,
                title: 'Build Your Profile',
                description: 'Create a compelling professional profile that showcases your achievements and attracts recruiters.',
              },
              {
                icon: Target,
                title: 'Browse & Apply',
                description: 'Explore thousands of opportunities and apply with your profile or custom resume instantly.',
              },
              {
                icon: BarChart3,
                title: 'Track Progress',
                description: 'Monitor your applications in real-time and get insights on your placement journey.',
              },
              {
                icon: MessageCircle,
                title: 'Connect Directly',
                description: 'Message companies, ask questions, and build relationships with hiring managers.',
              },
              {
                icon: CheckCircle,
                title: 'Interview Prep',
                description: 'Access resources and guidance to help you ace your interviews and land the offer.',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx}
                  className="p-8 rounded-2xl border border-[#e5e5e5] bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:border-[#8b5cf6]/50 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="mb-4 inline-block p-3 rounded-lg bg-gradient-to-br from-[#8b5cf6]/20 to-[#7c3aed]/20 group-hover:from-[#8b5cf6]/30 group-hover:to-[#7c3aed]/30 transition-all">
                    <Icon className="w-6 h-6 text-[#8b5cf6]" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 sm:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="relative p-12 rounded-3xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative text-center text-white">
              <h2 className="text-4xl font-bold mb-6">Ready to Launch Your Career?</h2>
              <p className="text-lg text-white/90 mb-8">Join thousands of students who've found their dream opportunities on SnaxHub</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-[#8b5cf6] hover:bg-white/90 h-12 font-semibold"
                  onClick={() => router.push('/signup?role=student')}
                >
                  Start as Student
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10 h-12 font-semibold"
                  onClick={() => router.push('/signup?role=company')}
                >
                  Hire Talent
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5]/50 py-12 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-foreground transition">My Applications</a></li>
                <li><a href="#" className="hover:text-foreground transition">My Profile</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition">LinkedIn</a></li>
                <li><a href="#" className="hover:text-foreground transition">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#e5e5e5] pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2024 Snax Hub. All rights reserved. | Made with care for your success.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
