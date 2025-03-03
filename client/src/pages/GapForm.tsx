import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  // Section 1: Informations personnelles
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  phone: z.string().optional(),
  
  // Section 2: Informations sur l'entreprise
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  website: z.string().optional(),
  sector: z.string().min(1, "Le secteur d'activité est requis"),
  companySize: z.string().min(1, "La taille de l'entreprise est requise"),
  revenue: z.string().optional(),
  
  // Section 3: Outils et infrastructure
  crm: z.string().optional(),
  billing: z.string().optional(),
  erp: z.string().optional(),
  office: z.string().optional(),
  reporting: z.string().optional(),
  otherTools: z.string().optional(),
  
  // Section 4: Processus à automatiser
  mainProcess: z.string().min(1, "Ce champ est requis"),
  frequency: z.string().optional(),
  timeSpent: z.string().optional(),
  existingSolutions: z.string().optional(),
  
  // Section 5: Objectifs et attentes
  expectedImpact: z.string().min(1, "Ce champ est requis"),
  expectedGains: z.string().optional(),
  priorities: z.string().optional(),
  
  // Section 6: Informations complémentaires
  comments: z.string().optional(),
  availability: z.string().optional(),
});

export default function GapForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = [
    "Informations personnelles",
    "Informations sur l'entreprise",
    "Outils et infrastructure existants",
    "Processus à automatiser",
    "Objectifs et attentes",
    "Informations complémentaires"
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      website: "",
      sector: "",
      companySize: "",
      revenue: "",
      crm: "",
      billing: "",
      erp: "",
      office: "",
      reporting: "",
      otherTools: "",
      mainProcess: "",
      frequency: "",
      timeSpent: "",
      existingSolutions: "",
      expectedImpact: "",
      expectedGains: "",
      priorities: "",
      comments: "",
      availability: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Ici nous enverrons les données au webhook n8n
      const response = await fetch('WEBHOOK_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du formulaire');
      }
      
      // Réinitialiser le formulaire après succès
      form.reset();
      setCurrentSection(0);
      
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
      <h1 className="text-4xl font-bold text-center mb-8">
        Générateur d'Automatisations Personnalisées
      </h1>
      
      <div className="mb-8">
        <Progress value={progress} className="w-full" />
        <p className="text-center mt-2 text-sm text-muted-foreground">
          {sections[currentSection]}
        </p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Les champs seront rendus conditionnellement selon la section courante */}
            
            <div className="flex justify-between mt-6">
              {currentSection > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentSection(prev => prev - 1)}
                >
                  Précédent
                </Button>
              )}
              
              {currentSection < sections.length - 1 ? (
                <Button
                  type="button"
                  className="ml-auto"
                  onClick={() => setCurrentSection(prev => prev + 1)}
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="ml-auto bg-primary hover:bg-primary/90"
                >
                  Recevoir mes automatisations personnalisées
                </Button>
              )}
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
