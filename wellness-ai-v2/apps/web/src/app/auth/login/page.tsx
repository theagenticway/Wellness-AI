'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        // Refresh session and redirect
        await getSession();
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="beforeInteractive" />
      
      <div className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden" style={{fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif'}}>
        <div>
          {/* Header */}
          <div className="flex items-center bg-white p-4 pb-2 justify-between">
            <h2 className="text-[#121516] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12 pr-12">Welcome Back</h2>
          </div>

          {/* Hero Image */}
          <div className="@container">
            <div className="@[480px]:px-4 @[480px]:py-3">
              <div
                className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-stone-50 @[480px]:rounded min-h-80"
                style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBgMB3MCa6TfaLAxeu2M7kkiOtFW8LcLVPJUM2-Ro7v-emvjtEaIDbRDVyIVF0honyyIy3N7MuxmWxmK1bRc8rLtMDV74mIf0hFvbkmIdfFvaYrcMARgeEYUz8yHn901HYqpBjISTbcSGlHI8wXyoRQIfhjFEVemFAEr-T9u0A9tNvgP-uU0bk2B6B_ERXkzRJaopT_LILRZ4RtQTLBhBNn9jLBQqHbSfokHUqSK-rzRff3jRtv6ZA15UiFx0YDljYzxAXyjyLCTA")'}}
              ></div>
            </div>
          </div>

          <h2 className="text-[#121516] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Welcome to WellnessAI</h2>
          <p className="text-[#121516] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
            Your journey to a healthier you with personalized insights and support
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121516] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7781] p-4 text-base font-normal leading-normal"
                />
              </label>
            </div>

            {/* Password Field */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121516] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7781] p-4 text-base font-normal leading-normal"
                />
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-4 my-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Sign In Button */}
            <div className="flex px-4 py-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#b2d0e5] text-[#121516] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#9ac4dd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="truncate">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </span>
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="px-4 py-2">
            <p className="text-[#648779] text-center text-sm">
              Don't have an account?{' '}
              <a href="/auth/register-stitch" className="text-[#111715] font-medium hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Illustration Placeholder */}
        <div>
          <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-none flex items-center justify-center bg-gray-50" style={{aspectRatio: '390 / 320'}}>
            <div className="text-center p-8">
              <div className="w-24 h-24 bg-[#1fdf92] rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#111715" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V96a8,8,0,0,1,16,0v44h24A8,8,0,0,1,168,148Z"/>
                </svg>
              </div>
              <p className="text-[#648779] text-sm">
                Welcome back to your wellness journey
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}