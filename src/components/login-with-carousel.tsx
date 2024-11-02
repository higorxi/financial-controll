'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

const images = [
  {
    src: "./placeholder.svg",
    caption: "Controle suas finanças com facilidade e precisão"
  },
  {
    src: "/placeholder.svg",
    caption: "Visualize seus gastos e economias em tempo real"
  },
  {
    src: "/placeholder.svg",
    caption: "Planeje seu futuro financeiro com confiança"
  }
]

export function LoginWithCarousel() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length)
    }, 2000) // Trocar a imagem a cada 2 segundos

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simular um processo de login
    // await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    console.log('Login attempt with:', { email, password })
  }

  return (
    <div className="flex min-h-screen">
      {/* Carrossel de imagens */}
      <div className="hidden lg:block lg:w-2/3 relative overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={image.src}
              alt={`Imagem do carrossel ${index + 1}`}
              width={1920}
              height={1080}
              className="object-cover w-full h-full" // Alinha as imagens
            />
          </div>
        ))}
        {/* Legenda e indicadores */}
        <div className="absolute bottom-8 left-8 right-8 bg-black bg-opacity-50 text-white p-4 rounded-lg">
          <p className="text-lg mb-2">{images[currentImage].caption}</p>
          <div className="flex justify-center space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentImage ? 'bg-white' : 'bg-gray-400'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Componente de login */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Bem-vindo ao FinControl</CardTitle>
            <CardDescription className="text-center">
              Entre para acessar seu controle financeiro
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
              <div className="text-center text-sm">
                <a href="#" className="text-primary hover:underline">Esqueceu sua senha?</a>
              </div>
            </CardFooter>
          </form>
          <div className="mt-6 text-center text-sm">
            Não tem uma conta?{' '}
            <a href="#" className="text-primary hover:underline font-semibold">
              Registre-se
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}
