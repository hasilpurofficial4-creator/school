import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">SH</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl leading-tight">Study Hub Lahore</h1>
              <p className="text-emerald-200 text-xs">Excellence in Education</p>
            </div>
          </div>
          <Link
            to="/login"
            className="px-6 py-2.5 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors shadow-lg"
          >
            Sign In
          </Link>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-emerald-100 text-sm font-medium mb-6">
            Matric & Intermediate Classes
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your Gateway to
            <br />
            <span className="text-yellow-300">Academic Excellence</span>
          </h2>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto mb-10">
            Study Hub Lahore provides a modern online examination platform for
            9th, 10th, 11th & 12th grade students with real-time results and
            comprehensive progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold rounded-xl transition-colors shadow-lg text-lg"
            >
              Get Started Now
            </Link>
            <a
              href="#about"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium rounded-xl transition-colors border border-white/20 text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: "500+", label: "Students Enrolled" },
            { number: "50+", label: "Expert Teachers" },
            { number: "200+", label: "Exams Conducted" },
            { number: "95%", label: "Pass Rate" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">{s.number}</div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">About Us</div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
              About Study Hub Lahore
            </h3>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Study Hub Lahore is a premier educational institution dedicated to
                providing quality education for Matric (9th & 10th) and
                Intermediate (11th & 12th) students. Our modern approach combines
                traditional teaching with cutting-edge technology.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Our state-of-the-art online examination system allows students to
                take MCQ-based exams from anywhere, receive instant results, and
                track their academic progress with detailed analytics.
              </p>
              <div className="space-y-4">
                {[
                  "Punjab Board aligned curriculum",
                  "Expert faculty with 10+ years experience",
                  "Digital exam platform with instant grading",
                  "Detailed performance analytics & result cards",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
              <h4 className="font-bold text-slate-900 text-xl mb-6">School Information</h4>
              <div className="space-y-4">
                {[
                  { icon: "🏫", label: "Institution", value: "Study Hub Lahore" },
                  { icon: "📍", label: "Location", value: "Lahore, Punjab, Pakistan" },
                  { icon: "📚", label: "Classes", value: "9th, 10th (Matric) • 11th, 12th (Inter)" },
                  { icon: "🎯", label: "Board", value: "Punjab Board (BISE Lahore)" },
                  { icon: "🕐", label: "Timings", value: "Mon-Sat: 8:00 AM - 3:00 PM" },
                  { icon: "📞", label: "Contact", value: "+92 300 1234567" },
                  { icon: "✉️", label: "Email", value: "info@studyhublahore.edu.pk" },
                  { icon: "🌐", label: "Website", value: "www.studyhublahore.edu.pk" },
                ].map((info) => (
                  <div key={info.label} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                    <span className="text-xl">{info.icon}</span>
                    <div>
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{info.label}</div>
                      <div className="text-slate-800 font-medium">{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Programs</div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Our Academic Programs</h3>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                grade: "9th Grade",
                board: "Matric Part-I",
                subjects: ["English", "Urdu", "Math", "Physics", "Chemistry", "Biology / Computer"],
                color: "from-blue-500 to-blue-600",
              },
              {
                grade: "10th Grade",
                board: "Matric Part-II",
                subjects: ["English", "Urdu", "Math", "Physics", "Chemistry", "Biology / Computer"],
                color: "from-emerald-500 to-emerald-600",
              },
              {
                grade: "11th Grade",
                board: "Inter Part-I",
                subjects: ["English", "Urdu", "Math / Economics", "Physics / Stats", "Chemistry / Banking", "Biology / Business"],
                color: "from-purple-500 to-purple-600",
              },
              {
                grade: "12th Grade",
                board: "Inter Part-II",
                subjects: ["English", "Urdu", "Math / Economics", "Physics / Stats", "Chemistry / Banking", "Biology / Business"],
                color: "from-orange-500 to-orange-600",
              },
            ].map((program) => (
              <div
                key={program.grade}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className={`bg-gradient-to-r ${program.color} p-5`}>
                  <div className="text-white/80 text-sm font-medium">{program.board}</div>
                  <div className="text-white text-2xl font-bold">{program.grade}</div>
                </div>
                <div className="p-5">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Subjects</div>
                  <div className="space-y-2">
                    {program.subjects.map((sub) => (
                      <div key={sub} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        {sub}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Why Choose Us</div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Platform Features</h3>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Online MCQ Exams",
                desc: "Take exams from anywhere with our secure online platform. Timed exams with auto-submission and instant grading.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Instant Results & Analytics",
                desc: "Get your results immediately after submission. View detailed score breakdowns, grades, and performance trends.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "HD Result Cards",
                desc: "Download high-quality result cards as PNG images. Share your achievements with professional-looking certificates.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Secure & Fair",
                desc: "Server-side answer verification ensures exam integrity. Anti-cheat measures with timed exams and secure scoring.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Multi-Role System",
                desc: "Dedicated dashboards for admins, teachers, and students. Teachers create exams, admins approve, students take them.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Cloud-Powered",
                desc: "Built on modern cloud infrastructure. Access your exams and results from any device, anywhere in the world.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-7 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-5">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-emerald-100 text-lg mb-8">
            Join hundreds of students already learning and excelling with Study Hub Lahore.
          </p>
          <Link
            to="/login"
            className="inline-block px-10 py-4 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold rounded-xl transition-colors shadow-lg text-lg"
          >
            Sign In to Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">SH</span>
                </div>
                <span className="text-white font-bold text-lg">Study Hub Lahore</span>
              </div>
              <p className="text-sm leading-relaxed">
                Providing quality education and modern examination solutions for
                Matric and Intermediate students in Lahore, Pakistan.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Quick Links</h5>
              <div className="space-y-2 text-sm">
                <a href="#about" className="block hover:text-emerald-400 transition-colors">About Us</a>
                <Link to="/login" className="block hover:text-emerald-400 transition-colors">Student Login</Link>
                <Link to="/login" className="block hover:text-emerald-400 transition-colors">Teacher Portal</Link>
                <Link to="/login" className="block hover:text-emerald-400 transition-colors">Admin Panel</Link>
              </div>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Contact Info</h5>
              <div className="space-y-2 text-sm">
                <p>123 Education Road, Lahore</p>
                <p>Punjab, Pakistan</p>
                <p>+92 300 1234567</p>
                <p>info@studyhublahore.edu.pk</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center text-sm">
            &copy; {new Date().getFullYear()} Study Hub Lahore. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
