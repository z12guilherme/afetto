import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Gift, FastForward, MessageSquareHeart, Award, Heart, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <motion.div 
              className="flex flex-col justify-center space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Presentes únicos e especiais
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                  Transformamos presentes em momentos inesquecíveis.
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Cestas e presentes personalizados para surpreender quem você ama. Monte a sua própria ou escolha um de nossos kits premium.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link to="/catalogo">
                  <Button size="lg" className="w-full min-[400px]:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                    Ver Catálogo
                  </Button>
                </Link>
                <Link to="/montar-cesta">
                  <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto border-secondary text-secondary hover:bg-secondary hover:text-white">
                    Montar Minha Cesta
                  </Button>
                </Link>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="ghost" className="w-full min-[400px]:w-auto">
                    Falar no WhatsApp
                  </Button>
                </a>
              </div>
            </motion.div>
            <div className="flex items-center justify-center">
              <motion.div 
                className="relative h-[450px] w-full sm:w-[450px] md:h-[550px] md:w-[550px] lg:h-[600px] lg:w-[600px] rounded-full bg-secondary/5 overflow-hidden flex items-center justify-center p-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                {/* Hero Image / 3D Heart Mockup */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full" />
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                  className="relative flex items-center justify-center w-full h-full z-10"
                >
                   <motion.div
                    animate={{ 
                      y: [0, -20, 0], 
                      rotate: [0, 5, -5, 0] 
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                   >
                     <Heart className="w-32 h-32 md:w-48 md:h-48 text-primary drop-shadow-[0_20px_20px_rgba(11,42,91,0.4)]" fill="currentColor" />
                   </motion.div>
                   
                   {/* Floating small hearts */}
                   <motion.div
                    className="absolute top-1/4 left-1/4"
                    animate={{ y: [0, -30, 0], x: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                   >
                      <Heart className="w-12 h-12 text-secondary opacity-70" fill="currentColor" />
                   </motion.div>

                   <motion.div
                    className="absolute bottom-1/4 right-1/4"
                    animate={{ y: [0, 40, 0], x: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                   >
                      <Heart className="w-16 h-16 text-primary opacity-60" fill="currentColor" />
                   </motion.div>

                   <motion.div
                    className="absolute top-1/3 right-1/3"
                    animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                   >
                      <Heart className="w-8 h-8 text-secondary" fill="currentColor" />
                   </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">Por que escolher a Afetto?</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Nossa dedicação vai além do presente. Cuidamos de cada detalhe para que a experiência seja perfeita.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.1 }}>
              <Card className="border-none shadow-md bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Gift className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Personalização Total</h3>
                  <p className="text-muted-foreground">Monte o presente do seu jeito com os produtos favoritos da pessoa amada.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }}>
              <Card className="border-none shadow-md bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FastForward className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Entrega Rápida</h3>
                  <p className="text-muted-foreground">Receba em casa ou envie diretamente para o endereço de quem você ama.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.3 }}>
              <Card className="border-none shadow-md bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <MessageSquareHeart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Mensagens Exclusivas</h3>
                  <p className="text-muted-foreground">Adicione cartas e recados personalizados para emocionar.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.4 }}>
              <Card className="border-none shadow-md bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Qualidade Garantida</h3>
                  <p className="text-muted-foreground">Todos os produtos são selecionados cuidadosamente para garantir a melhor experiência.</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Datas Especiais Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            {...fadeInUp}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">Para todas as Ocasiões</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Temos opções perfeitas para comemorar os melhores momentos do ano.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {[
              { icon: Heart, label: "Dia dos Namorados" },
              { icon: Gift, label: "Páscoa" },
              { icon: Calendar, label: "Natal" },
              { icon: Heart, label: "Dia das Mães" },
              { icon: Heart, label: "Dia dos Pais" },
              { icon: Gift, label: "Aniversários" },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="flex flex-col items-center space-y-3 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all cursor-pointer"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <div className="p-4 bg-background rounded-full shadow-sm text-secondary">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="font-medium">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <motion.div 
          className="container px-4 md:px-6 flex flex-col items-center space-y-6"
          {...fadeInUp}
        >
          <h2 className="text-3xl font-bold max-w-2xl">Pronto para criar uma memória inesquecível?</h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl">
            Surpreenda quem você ama com um presente feito especialmente para ela.
          </p>
          <Link to="/montar-cesta">
            <Button size="lg" variant="secondary" className="mt-4 shrink-0 text-primary font-semibold text-lg px-8 py-6 rounded-full">
              Começar Agora
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
