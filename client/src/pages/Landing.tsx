import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-rose-50">
      {/* background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-rose-300/40 blur-3xl" />

      {/* nav */}
      <header className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center">
          <span className="text-xl font-black tracking-tight">HalfBake</span>
          <div className="ml-auto flex gap-3">
            <Link to="/login?tab=login" className="px-4 py-2 rounded-xl border hover:bg-white/70">
              Login
            </Link>
            <Link to="/login?tab=register" className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <main className="relative z-10">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-black tracking-tight"
          >
            Share your <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
              half-baked
            </span>{" "}
            ideas.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-4 text-lg text-gray-600"
          >
            Post rough concepts. Let builders pick them up, refine them, or fork them into something real.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <Link
              to="/login?tab=register"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg hover:scale-[1.02] transition"
            >
              Get started — Register
            </Link>
            <Link
              to="/login?tab=login"
              className="px-6 py-3 rounded-2xl border bg-white/60 backdrop-blur hover:bg-white"
            >
              I already have an account
            </Link>
          </motion.div>

          {/* tiny animation hint */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="mt-12 inline-flex items-center gap-2 text-sm text-gray-500"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            ideas don’t have to be perfect — just posted.
          </motion.div>
        </div>
      </main>
    </div>
  );
}
