import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { RainbowText } from "@/components/RainbowText";
import { motion } from "framer-motion";

const formSchema = z.object({
  // Section 1: Informations personnelles et entreprise (tous obligatoires)
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  phone: z.string().optional(),
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  website: z.string().min(1, "L'URL de l'entreprise est requise"),

  // Les sections suivantes sont optionnelles
  sector: z.string().optional(),
  companySize: z.string().optional(),
  revenue: z.string().optional(),
  crm: z.string().optional(),
  billing: z.string().optional(),
  erp: z.string().optional(),
  office: z.string().optional(),
  reporting: z.string().optional(),
  otherTools: z.string().optional(),
  mainProcess: z.string().optional(),
  frequency: z.string().optional(),
  timeSpent: z.string().optional(),
  existingSolutions: z.string().optional(),
  expectedImpact: z.string().optional(),
  expectedGains: z.string().optional(),
  priorities: z.string().optional(),
  comments: z.string().optional(),
  availability: z.string().optional(),
});

export default function GapForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const { toast } = useToast();

  const sections = [
    {
      title: "Informations essentielles",
      subtitle: "",
      fields: [
        { name: "firstName", label: "Prénom", placeholder: "Votre prénom", type: "text", required: true },
        { name: "lastName", label: "Nom", placeholder: "Votre nom", type: "text", required: true },
        { name: "email", label: "Adresse email", placeholder: "ex: prenom.nom@example.com", type: "email", required: true },
        { name: "phone", label: "Téléphone", placeholder: "ex: +33 6 12 34 56 78", type: "tel" },
        { name: "companyName", label: "Nom de l'entreprise", placeholder: "Nom de votre entreprise", type: "text", required: true },
        { name: "website", label: "URL du site ou profil LinkedIn", placeholder: "ex: https://www.votreentreprise.fr", type: "url", required: true }
      ]
    },
    {
      title: "Informations sur l'entreprise",
      subtitle: "Ces détails nous aideront à mieux comprendre votre contexte",
      fields: [
        { name: "sector", label: "Secteur d'activité", placeholder: "ex: E-commerce, Marketing, Distribution..." },
        {
          name: "companySize",
          label: "Taille de l'entreprise",
          type: "select",
          options: ["1", "2 à 9", "10 à 50", "50 à 150", "150+"]
        },
        {
          name: "revenue",
          label: "Chiffre d'affaires annuel",
          type: "select",
          options: ["0 - 100k€", "100k - 1M€", "1M - 10M€", "+10M€", "Donnée confidentielle"]
        }
      ]
    },
    {
      title: "Outils et infrastructure existants",
      subtitle: "Ces informations nous permettront de proposer des automatisations compatibles avec vos outils",
      fields: [
        { name: "crm", label: "Outil CRM utilisé", placeholder: "ex: Hubspot, Salesforce, etc." },
        { name: "billing", label: "Outil de facturation/comptabilité", placeholder: "ex: Henrii, Indy, Facture.net, etc." },
        { name: "erp", label: "ERP ou outils de gestion commerciale", placeholder: "ex: Axonaut, noCRM, etc." },
        { name: "office", label: "Suite bureautique", placeholder: "ex: Google Workspace, Office 365, etc." },
        { name: "reporting", label: "Outils de reporting et d'analyse", placeholder: "ex: Power BI, Tableau, Google Sheets, etc." },
        { name: "otherTools", label: "Autres outils métiers", placeholder: "Précisez, si applicable" }
      ]
    },
    {
      title: "Processus à automatiser",
      subtitle: "Plus vous nous en direz, plus nos recommandations seront pertinentes",
      fields: [
        { name: "mainProcess", label: "Quel processus manuel vous coûte le plus de temps ?", placeholder: "ex: Résolution manuelle des tickets de support" },
        { name: "frequency", label: "Fréquence / Volume de ce processus", placeholder: "ex: quotidien, hebdomadaire, mensuel" },
        { name: "timeSpent", label: "Temps moyen consacré à ce processus par semaine (en heures)", placeholder: "ex: 10" },
        { name: "existingSolutions", label: "Avez-vous déjà envisagé des solutions d'automatisation ?", placeholder: "ex: Oui, j'ai pensé à utiliser un chatbot…" }
      ]
    },
    {
      title: "Objectifs et attentes",
      subtitle: "Aidez-nous à comprendre vos priorités",
      fields: [
        { name: "expectedImpact", label: "Quel serait l'impact attendu sur votre productivité ?", placeholder: "ex: Gain de temps, réduction des erreurs, amélioration de la réactivité" },
        { name: "expectedGains", label: "Quels gains attendez-vous (en temps, coûts, qualité) ?", placeholder: "ex: Réduction de 50% du temps de traitement" },
        { name: "priorities", label: "Priorités en matière d'automatisation", placeholder: "ex: ROI rapide, facilité d'implémentation, scalabilité" }
      ]
    },
    {
      title: "Informations complémentaires",
      subtitle: "Des précisions qui nous aideront à affiner nos recommandations",
      fields: [
        { name: "comments", label: "Commentaires ou contraintes spécifiques", placeholder: "Exemple : contraintes techniques, budget, etc." },
        { name: "availability", label: "Disponibilité pour un rendez-vous", placeholder: "Ex: Après-midi, matinée, jours précis, etc." }
      ]
    }
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "",
      companyName: "", website: "", sector: "", companySize: "", revenue: "",
      crm: "", billing: "", erp: "", office: "", reporting: "", otherTools: "",
      mainProcess: "", frequency: "", timeSpent: "", existingSolutions: "",
      expectedImpact: "", expectedGains: "", priorities: "",
      comments: "", availability: "",
    },
  });

  const isFirstSectionValid = () => {
    const requiredFields = ["firstName", "lastName", "email", "companyName", "website"];
    return requiredFields.every(field => {
      const value = form.getValues(field as keyof z.infer<typeof formSchema>);
      return value && value.trim() !== "";
    });
  };

  const handleNext = () => {
    if (currentSection === 0 && !isFirstSectionValid()) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires avant de continuer.",
      });
      return;
    }
    setCurrentSection(prev => prev + 1);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!isFirstSectionValid()) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires avant d'envoyer le formulaire.",
      });
      setCurrentSection(0);
      return;
    }

    try {
      const params = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          params.append(key, value.toString());
        }
      });

      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL ||
                        window.location.origin + '/api/webhook-test';

      const response = await fetch(`${webhookUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'envoi du formulaire: ${response.status}`);
      }

      toast({
        title: "Formulaire envoyé avec succès !",
        description: "Nous vous contacterons rapidement avec des solutions personnalisées.",
      });

      // Redirection vers la page d'accueil
      window.location.href = '/';

    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du formulaire.",
      });
    }
  };

  const progress = ((currentSection + 1) / sections.length) * 100;

  const renderField = (field: any) => {
    // Classes pour centrer sur mobile
    const containerClasses = "w-full text-center sm:text-left mx-auto";
    const labelClasses = "flex justify-center sm:justify-start text-gray-200";

    if (field.type === "select" && field.options) {
      return (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem className={containerClasses}>
              <FormLabel className={labelClasses}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Select onValueChange={formField.onChange} value={formField.value}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {field.options.map((option: string) => (
                      <SelectItem key={option} value={option} className="text-gray-200 hover:bg-gray-700">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem className={containerClasses}>
            <FormLabel className={labelClasses}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <Input
                {...formField}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500 w-full"
              />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="relative z-[2] container mx-auto px-4 py-8 min-h-screen flex flex-col">
        <Link href="/" className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors">
          ← Retour
        </Link>

        <div className="flex-grow flex flex-col justify-center mt-12 sm:mt-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 px-4">
            Générateur d'<RainbowText>Automatisations</RainbowText> Personnalisées
          </h1>

          <p className="text-lg sm:text-xl text-center text-gray-300 mb-8 max-w-2xl mx-auto px-4">
            Remplissez vos informations et recevez par email des automatisations qui vont faire exploser votre productivité
          </p>

          <div className="mb-8 px-4">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <Card className="p-4 sm:p-6 mx-4 sm:mx-auto w-full max-w-2xl bg-gray-800/50 border-gray-700">
            <div className="mb-6 text-center sm:text-left">
              <h2 className="text-xl font-semibold mb-2">{sections[currentSection].title}</h2>
              {sections[currentSection].subtitle && (
                <p className="text-gray-400">{sections[currentSection].subtitle}</p>
              )}
              {currentSection === 0 && (
                <p className="text-sm text-orange-500 mt-2">* Ces champs sont obligatoires pour recevoir vos automatisations personnalisées</p>
              )}
              {currentSection !== 0 && (
                <p className="text-sm text-blue-400 mt-2">Plus vous nous donnez d'informations, plus les automatisations proposées seront précises et adaptées à vos besoins</p>
              )}
            </div>

            <Form {...form}>
              <form className="space-y-6">
                <div className="space-y-4">
                  {sections[currentSection].fields.map(renderField)}
                </div>

                <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 mt-6">
                  {currentSection === sections.length - 1 && (
                    <Button
                      type="submit"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={!isFirstSectionValid()}
                      className={`w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white ${
                        !isFirstSectionValid() ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Recevoir mes automatisations
                    </Button>
                  )}

                  <div className="flex w-full justify-center sm:justify-start sm:w-auto gap-4">
                    {currentSection > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentSection(prev => prev - 1)}
                        className="flex-1 max-w-[45%] sm:max-w-none sm:flex-none border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Précédent
                      </Button>
                    )}
                    {currentSection < sections.length - 1 && (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 max-w-[45%] sm:max-w-none sm:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      >
                        Suivant
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}