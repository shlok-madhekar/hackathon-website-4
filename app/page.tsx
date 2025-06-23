"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Clock,
  Github,
  Laptop,
  Lightbulb,
  Linkedin,
  MapPin,
  PawPrint,
  Sparkles,
  Twitter,
  Zap,
} from "lucide-react"
import { useState, useEffect, useRef, useMemo } from "react"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("about")
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [prevSeconds, setPrevSeconds] = useState(0)
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    about: ""
  });

  const aboutRef = useRef<HTMLDivElement>(null)

  // Pre-generate blob positions for better performance
  const blobsConfig = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      width: `${Math.random() * 300 + 100}px`,
      height: `${Math.random() * 300 + 100}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 20 + 30}s`,
      delay: `${Math.random() * -30}s`,
      opacity: Math.random() * 0.5 + 0.2,
    }))
  }, [])

  // Calculate countdown with requestAnimationFrame for smoother updates
  useEffect(() => {
    const targetDate = new Date("2025-08-23T09:00:00")
    let animationFrameId: number

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        // Store previous seconds to detect changes
        setPrevSeconds(timeLeft.seconds)

        setTimeLeft({ days, hours, minutes, seconds })
      }

      animationFrameId = requestAnimationFrame(calculateTimeLeft)
    }

    // Initial calculation
    calculateTimeLeft()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [timeLeft.seconds])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch (err) {
      // Optionally handle error
    }
    setTimeout(() => setSubmitted(false), 3000);
  };

  const scrollToAbout = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" })
    }
    setActiveTab("about")
  }

  return (
    <div className="flex min-h-screen flex-col relative bg-black">
      {/* Background Animation - Optimized with transform: will-change and GPU acceleration */}
      <div className="fixed inset-0 -z-10 bg-black">
        <div className="absolute inset-0 overflow-hidden">
          {blobsConfig.map((blob, i) => (
            <div
              key={i}
              className="absolute bg-violet/10 rounded-full blur-xl"
              style={{
                width: blob.width,
                height: blob.height,
                top: blob.top,
                left: blob.left,
                animation: "floatBlob",
                animationDuration: blob.duration,
                animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                animationIterationCount: "infinite",
                animationDelay: blob.delay,
                opacity: blob.opacity,
                willChange: "transform",
                transform: "translate3d(0, 0, 0)",
              }}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes floatBlob {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          25% {
            transform: translate3d(5%, -5%, 0) scale(1.03);
          }
          50% {
            transform: translate3d(10%, 5%, 0) scale(0.98);
          }
          75% {
            transform: translate3d(5%, 10%, 0) scale(1.03);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        .glow {
          box-shadow: 0 0 20px 2px rgba(139, 92, 246, 0.4);
        }

        .countdown-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          perspective: 1000px;
          will-change: transform, opacity;
        }

        .countdown-item.flip {
          animation: flipNumber 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes flipNumber {
          0% {
            transform: rotateX(0deg);
          }
          50% {
            transform: rotateX(90deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }
      `}</style>

      <header className="sticky top-0 z-50 w-full border-b bg-black/80 backdrop-blur-md supports-[backdrop-filter]:bg-black/60 border-gray-800">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-violet" />
            <span className="text-xl font-bold font-mono tracking-tight">Grizzly Hacks</span>
          </div>
          <nav className="hidden md:flex gap-6">
            {["about", "schedule", "sponsors", "team", "register"].map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`text-sm uppercase tracking-wide transition-all duration-200 font-mono ${
                  activeTab === item ? "text-violet font-medium" : "text-foreground hover:text-violet"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setActiveTab("register")}
              className="bg-violet text-white hover:bg-violet/90 font-mono"
            >
              Register
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section
          className={`w-full py-12 md:py-20 lg:py-28 transition-all duration-500 ${isLoaded ? "opacity-100" : "opacity-0 translate-y-10"}`}
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col max-w-4xl mx-auto text-center items-center space-y-4">
              <div className="inline-block p-1 bg-gradient-to-r from-violet to-violet/50 rounded-lg mb-4">
                <div className="bg-black px-3 py-1 rounded-md">
                  <p className="text-sm font-medium">August 23, 2025 • San Francisco, CA</p>
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-bold font-mono tracking-tight sm:text-6xl md:text-7xl/none text-violet">
                  Grizzly Hacks <span className="text-white">2025</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                  Where innovation meets opportunity. A 24-hour hackathon to build the future.
                </p>
              </div>

              {/* Improved Countdown Timer with flip animation */}
              <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-xl w-full my-4 md:my-8">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`countdown-item flex items-center justify-center w-full aspect-square bg-white/5 backdrop-blur-sm rounded-lg border border-violet/20 font-mono text-2xl md:text-4xl font-bold ${
                        i === 3 && timeLeft.seconds !== prevSeconds ? "flip" : ""
                      }`}
                    >
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <span className="text-xs mt-1 text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 min-[400px]:flex-row mt-4">
                <Button
                  onClick={() => setActiveTab("register")}
                  className="bg-violet text-white hover:bg-violet/90 font-mono glow"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Register Now
                </Button>
                <Button onClick={scrollToAbout} variant="outline" size="lg" className="border-violet/30 text-white">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="w-full py-8 md:py-12">
          <div className="container px-4 md:px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-5 mb-8 bg-black/40">
                <TabsTrigger value="about" className="text-xs tracking-wider font-mono">
                  ABOUT
                </TabsTrigger>
                <TabsTrigger value="schedule" className="text-xs tracking-wider font-mono">
                  SCHEDULE
                </TabsTrigger>
                <TabsTrigger value="sponsors" className="text-xs tracking-wider font-mono">
                  SPONSORS
                </TabsTrigger>
                <TabsTrigger value="team" className="text-xs tracking-wider font-mono">
                  TEAM
                </TabsTrigger>
                <TabsTrigger value="register" className="text-xs tracking-wider font-mono">
                  REGISTER
                </TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-8 animate-fade-in">
                <div ref={aboutRef} className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold font-mono tracking-tight text-violet mb-4">About the Hackathon</h2>
                  <p className="text-muted-foreground mb-6">
                    Grizzly Hacks is a 24-hour hackathon bringing together developers, designers, and entrepreneurs to
                    build innovative solutions to real-world problems.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-black/50 border border-gray-800 rounded-lg p-6 hover:border-violet transition-colors group">
                      <div className="rounded-full w-10 h-10 bg-violet/20 flex items-center justify-center mb-4 group-hover:bg-violet/30 transition-colors">
                        <Laptop className="h-5 w-5 text-violet" />
                      </div>
                      <h3 className="text-xl font-medium font-mono mb-2">Build</h3>
                      <p className="text-muted-foreground">
                        Work with cutting-edge technologies and tools to build innovative projects that solve real
                        problems.
                      </p>
                    </div>
                    <div className="bg-black/50 border border-gray-800 rounded-lg p-6 hover:border-violet transition-colors group">
                      <div className="rounded-full w-10 h-10 bg-violet/20 flex items-center justify-center mb-4 group-hover:bg-violet/30 transition-colors">
                        <Lightbulb className="h-5 w-5 text-violet" />
                      </div>
                      <h3 className="text-xl font-medium font-mono mb-2">Learn</h3>
                      <p className="text-muted-foreground">
                        Gain knowledge through workshops, mentoring, and collaboration with fellow hackers.
                      </p>
                    </div>
                    <div className="bg-black/50 border border-gray-800 rounded-lg p-6 hover:border-violet transition-colors group">
                      <div className="rounded-full w-10 h-10 bg-violet/20 flex items-center justify-center mb-4 group-hover:bg-violet/30 transition-colors">
                        <Sparkles className="h-5 w-5 text-violet" />
                      </div>
                      <h3 className="text-xl font-medium font-mono mb-2">Win</h3>
                      <p className="text-muted-foreground">
                        Compete for prizes and recognition. Show off your skills and win big!
                      </p>
                    </div>
                  </div>

                  <div className="mt-12 bg-black/50 border border-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-medium font-mono mb-4">Why Participate?</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <span className="text-violet mr-2">→</span>
                        <span>Network with industry professionals and fellow tech enthusiasts</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-violet mr-2">→</span>
                        <span>Learn new technologies and improve your skills</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-violet mr-2">→</span>
                        <span>Build your portfolio with impressive projects</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-violet mr-2">→</span>
                        <span>Win prizes and potential job opportunities</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule" className="space-y-8 animate-fade-in">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold font-mono tracking-tight text-violet mb-4">Event Schedule</h2>
                  <p className="text-muted-foreground mb-6">One intense day of hacking, learning, and networking.</p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-medium font-mono mb-4 inline-flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-violet" />
                        August 23 - 24 Hour Sprint
                      </h3>
                      <div className="space-y-4 mt-4 border-l-2 border-violet/30 pl-4">
                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet"></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium font-mono">Registration & Breakfast</h4>
                              <p className="text-sm text-muted-foreground">
                                Get your badge, meet other participants, and enjoy breakfast
                              </p>
                            </div>
                            <span className="text-sm text-violet font-mono">09:00 AM</span>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet"></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium font-mono">Opening Ceremony</h4>
                              <p className="text-sm text-muted-foreground">
                                Welcome address, rules explanation, and sponsor introductions
                              </p>
                            </div>
                            <span className="text-sm text-violet font-mono">10:00 AM</span>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet"></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium font-mono">Team Formation & Hacking Begins</h4>
                              <p className="text-sm text-muted-foreground">
                                Find teammates, brainstorm ideas, and start building your projects
                              </p>
                            </div>
                            <span className="text-sm text-violet font-mono">11:00 AM</span>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet"></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium font-mono">Lunch & Networking</h4>
                              <p className="text-sm text-muted-foreground">Refuel and connect with mentors</p>
                            </div>
                            <span className="text-sm text-violet font-mono">01:00 PM</span>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet"></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium font-mono">Workshops & Mentoring</h4>
                              <p className="text-sm text-muted-foreground">
                                Technical workshops and one-on-one mentoring sessions
                              </p>
                            </div>
                            <span className="text-sm text-violet font-mono">03:00 PM</span>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet"></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium font-mono">Dinner</h4>
                              <p className="text-sm text-muted-foreground">Evening meal and continued hacking</p>
                            </div>
                            <span className="text-sm text-violet font-mono">07:00 PM</span>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet"></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium font-mono">Final Sprint</h4>
                              <p className="text-sm text-muted-foreground">Last hours to polish your projects</p>
                            </div>
                            <span className="text-sm text-violet font-mono">10:00 PM</span>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet"></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium font-mono">Hacking Ends & Submissions</h4>
                              <p className="text-sm text-muted-foreground">Pencils down! Submit your projects</p>
                            </div>
                            <span className="text-sm text-violet font-mono">09:00 AM</span>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet"></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium font-mono">Project Presentations</h4>
                              <p className="text-sm text-muted-foreground">Teams present their projects to judges</p>
                            </div>
                            <span className="text-sm text-violet font-mono">09:30 AM</span>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-violet"></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium font-mono">Awards & Closing</h4>
                              <p className="text-sm text-muted-foreground">Winners announced and final remarks</p>
                            </div>
                            <span className="text-sm text-violet font-mono">11:00 AM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Sponsors Tab */}
              <TabsContent value="sponsors" className="space-y-8 animate-fade-in">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold font-mono tracking-tight text-violet mb-4">Our Sponsors</h2>
                  <p className="text-muted-foreground mb-6">
                    Thanks to our amazing sponsors who make this event possible.
                  </p>

                  <div className="mt-8">
                    <h3 className="text-xl font-medium font-mono mb-6">Platinum Sponsors</h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-black/50 border border-gray-800 rounded-lg p-6 hover:border-violet transition-colors flex items-center justify-center h-32 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] group"
                        >
                          <div className="text-center text-gray-400 group-hover:text-violet transition-colors">
                            <Sparkles className="h-8 w-8 mx-auto mb-2" />
                            <span className="font-mono">SPONSOR {i}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-12">
                    <h3 className="text-xl font-medium font-mono mb-6">Gold Sponsors</h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="bg-black/50 border border-gray-800 rounded-lg p-4 hover:border-violet transition-colors flex items-center justify-center h-24 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] group"
                        >
                          <div className="text-center text-gray-400 group-hover:text-violet transition-colors">
                            <span className="font-mono text-sm">SPONSOR {i}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-12 text-center">
                    <h3 className="text-xl font-medium font-mono mb-4">Interested in Sponsoring?</h3>
                    <p className="text-muted-foreground mb-4">
                      Support the next generation of innovators and get your brand in front of top talent.
                    </p>
                    <Button className="bg-violet text-white hover:bg-violet/90 font-mono glow">Become a Sponsor</Button>
                  </div>
                </div>
              </TabsContent>

              {/* Team Tab */}
              <TabsContent value="team" className="space-y-8 animate-fade-in">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold font-mono tracking-tight text-violet mb-4">Meet Our Team</h2>
                  <p className="text-muted-foreground mb-8">
                    The passionate individuals behind Grizzly Hacks who make this event possible.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: "Alex Chen", role: "Lead Organizer", icon: <Sparkles className="h-5 w-5 text-violet" /> },
                      {
                        name: "Maya Rodriguez",
                        role: "Technical Director",
                        icon: <Zap className="h-5 w-5 text-violet" />,
                      },
                      {
                        name: "Jamal Wilson",
                        role: "Sponsorship Coordinator",
                        icon: <Laptop className="h-5 w-5 text-violet" />,
                      },
                      {
                        name: "Sarah Kim",
                        role: "Marketing Lead",
                        icon: <Lightbulb className="h-5 w-5 text-violet" />,
                      },
                      {
                        name: "David Patel",
                        role: "Operations Manager",
                        icon: <Clock className="h-5 w-5 text-violet" />,
                      },
                      {
                        name: "Olivia Johnson",
                        role: "Design Lead",
                        icon: <Sparkles className="h-5 w-5 text-violet" />,
                      },
                      {
                        name: "Marcus Lee",
                        role: "Mentorship Coordinator",
                        icon: <Lightbulb className="h-5 w-5 text-violet" />,
                      },
                      {
                        name: "Emma Garcia",
                        role: "Venue Coordinator",
                        icon: <MapPin className="h-5 w-5 text-violet" />,
                      },
                      {
                        name: "Tyler Washington",
                        role: "Community Manager",
                        icon: <Laptop className="h-5 w-5 text-violet" />,
                      },
                    ].map((member, i) => (
                      <div
                        key={i}
                        className="bg-black/50 border border-gray-800 rounded-lg p-5 hover:border-violet transition-all group hover:translate-y-[-2px] hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                      >
                        <div className="flex items-start gap-4">
                          <div className="rounded-full w-10 h-10 bg-violet/20 flex items-center justify-center flex-shrink-0 group-hover:bg-violet/30 transition-colors">
                            {member.icon}
                          </div>
                          <div>
                            <h4 className="font-medium font-mono text-lg">{member.name}</h4>
                            <p className="text-sm text-violet mt-1">{member.role}</p>
                            <p className="text-sm text-muted-foreground mt-3 hidden sm:block">
                              Passionate about {i % 2 === 0 ? "technology" : "innovation"} and building communities.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 bg-black/50 border border-gray-800 rounded-lg p-6 text-center">
                    <h3 className="text-xl font-medium font-mono mb-4">Join Our Team</h3>
                    <p className="text-muted-foreground mb-4">
                      Interested in helping organize future hackathons? We're always looking for passionate volunteers!
                    </p>
                    <Button className="bg-violet text-white hover:bg-violet/90 font-mono">Apply to Volunteer</Button>
                  </div>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-8 animate-fade-in">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold font-mono tracking-tight text-violet mb-4">Register Now</h2>
                  <p className="text-muted-foreground mb-6">
                    Secure your spot for Grizzly Hacks 2025. Limited seats available for this intense 24-hour challenge!
                  </p>

                  {submitted ? (
                    <div className="bg-violet/10 border border-violet rounded-lg p-6 text-center">
                      <h3 className="text-xl font-medium font-mono mb-2 text-violet">Registration Submitted!</h3>
                      <p className="text-muted-foreground">
                        Thank you for registering. Check your email for confirmation details.
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <form onSubmit={handleRegister} className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium font-mono">Full Name</label>
                            <Input
                              type="text"
                              required
                              className="font-mono bg-black/50 border border-gray-800 focus:border-violet"
                              placeholder="Your name"
                              value={form.name}
                              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium font-mono">Email</label>
                            <Input
                              type="email"
                              required
                              className="font-mono bg-black/50 border border-gray-800 focus:border-violet"
                              placeholder="your@email.com"
                              value={form.email}
                              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            />
                            <p className="text-xs text-muted-foreground">
                              We'll send confirmation details to this email
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium font-mono">University/Company</label>
                            <Input
                              type="text"
                              required
                              className="font-mono bg-black/50 border border-gray-800 focus:border-violet"
                              placeholder="Where you work or study"
                              value={form.organization}
                              onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium font-mono">Tell us about yourself</label>
                            <Textarea
                              className="bg-black/50 border border-gray-800 focus:border-violet"
                              placeholder="Your experience, skills, and what you hope to learn"
                              rows={4}
                              value={form.about}
                              onChange={e => setForm(f => ({ ...f, about: e.target.value }))}
                            />
                          </div>

                          <div className="pt-4">
                            <Button
                              type="submit"
                              className="w-full bg-violet text-white hover:bg-violet/90 font-mono glow"
                            >
                              <Sparkles className="mr-2 h-4 w-4" /> Register
                            </Button>
                          </div>
                        </form>
                      </div>

                      <div className="bg-black/50 border border-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-medium font-mono mb-4">FAQ</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium font-mono">Do I need a team?</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              No, you can join solo and find teammates at the event.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium font-mono">Is there a registration fee?</h4>
                            <p className="text-sm text-muted-foreground mt-1">No, participation is completely free.</p>
                          </div>
                          <div>
                            <h4 className="font-medium font-mono">What should I bring?</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Laptop, charger, and any hardware you want to work with.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium font-mono">Will there be prizes?</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Yes! We have exciting prizes for the winning teams.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium font-mono">I'm a beginner. Can I participate?</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              We welcome participants of all skill levels.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-black border-gray-800 py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
          <div className="flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-violet" />
            <span className="text-lg font-bold font-mono tracking-tight">Grizzly Hacks</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Grizzly Hacks. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-muted-foreground hover:text-violet transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-violet transition-colors">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-violet transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
