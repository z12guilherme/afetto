import { Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function About() {
  return (
    <div className="bg-muted/10 min-h-[calc(100vh-4rem)] py-16 px-4">
      <div className="container mx-auto max-w-4xl space-y-16">
        
        {/* Story Section */}
        <section className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-primary tracking-tight">Nossa História</h1>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-lg">
              A Afetto nasceu do desejo de transformar presentes comuns em gestos profundos de carinho e afeto.
            </p>
          </motion.div>
          
          <motion.div 
            className="aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-lg relative bg-primary/20 flex items-center justify-center text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-primary/20" />
            <div className="relative z-10 flex flex-col items-center p-6 text-center max-w-lg">
              <Heart className="h-12 w-12 text-secondary animate-pulse mb-3" fill="currentColor" />
              <p className="text-xl font-bold">"Onde há afeto, há um momento inesquecível."</p>
            </div>
          </motion.div>
        </section>

        {/* Vision, Mission, Values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-border/50 space-y-3">
            <div className="p-3 bg-primary/10 rounded-full w-fit text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-primary">Nossa Missão</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Proporcionar a melhor experiência de presentear com afeto, oferecendo facilidade na customização e entrega rápida de presentes inesquecíveis.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-border/50 space-y-3">
            <div className="p-3 bg-primary/10 rounded-full w-fit text-primary">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-primary">Nossa Visão</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ser a maior e mais querida plataforma de cestas personalizadas e presentes pegue e monte do país, conectando pessoas através de momentos especiais.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-border/50 space-y-3">
            <div className="p-3 bg-primary/10 rounded-full w-fit text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-primary">Nossos Valores</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Amor em cada detalhe, qualidade inegociável nos produtos selecionados, transparência com os clientes e inovação tecnológica contínua.
            </p>
          </div>
        </section>

        {/* Detailed text */}
        <section className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Fundada em 2024, a <strong>Afetto</strong> surgiu da necessidade de um serviço de presentes que fosse verdadeiramente personalizado. Acreditamos que nenhuma pessoa é igual à outra e, por isso, os presentes também não devem ser.
          </p>
          <p>
            Com o nosso sistema exclusivo "Pegue e Monte", você tem controle total. Escolha a cesta base que mais combina com a ocasião, adicione os chocolates favoritos, o perfume predileto, pelúcias e até um cartão personalizado com a sua própria mensagem. Nós cuidamos da montagem impecável e da entrega com toda a segurança.
          </p>
        </section>
      </div>
    </div>
  );
}
