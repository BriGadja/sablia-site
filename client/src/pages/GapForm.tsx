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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

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
  const { toast } = useToast();

  const sections = [
    {
      title: "Informations personnelles",
      fields: [
        { name: "firstName", label: "Prénom", placeholder: "Votre prénom", type: "text", required: true },
        { name: "lastName", label: "Nom", placeholder: "Votre nom", type: "text", required: true },
        { name: "email", label: "Adresse email", placeholder: "ex: prenom.nom@example.com", type: "email", required: true },
        { name: "phone", label: "Téléphone", placeholder: "ex: +33 6 12 34 56 78", type: "tel" }
      ]
    },
    {
      title: "Informations sur l'entreprise",
      fields: [
        { name: "companyName", label: "Nom de l'entreprise", placeholder: "Nom de votre entreprise", type: "text", required: true },
        { name: "website", label: "URL du site ou profil LinkedIn", placeholder: "ex: https://www.votreentreprise.fr", type: "url" },
        { name: "sector", label: "Secteur d'activité", placeholder: "ex: E-commerce, Marketing, Distribution...", type: "text", required: true },
        { name: "companySize", label: "Taille de l'entreprise", placeholder: "Nombre d'employés (ex: 1-10, 11-50, etc.)", type: "text", required: true },
        { name: "revenue", label: "Chiffre d'affaires annuel", type: "select", options: ["0 - 100k€", "100k - 1M€", "1M - 10M€", "+10M€"] }
      ]
    },
    {
      title: "Outils et infrastructure existants",
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
      fields: [
        { name: "mainProcess", label: "Quel processus manuel vous coûte le plus de temps ?", placeholder: "ex: Résolution manuelle des tickets de support", required: true },
        { name: "frequency", label: "Fréquence / Volume de ce processus", placeholder: "ex: quotidien, hebdomadaire, mensuel" },
        { name: "timeSpent", label: "Temps moyen consacré à ce processus par semaine (en heures)", placeholder: "ex: 10" },
        { name: "existingSolutions", label: "Avez-vous déjà envisagé des solutions d'automatisation ?", placeholder: "ex: Oui, j'ai pensé à utiliser un chatbot…" }
      ]
    },
    {
      title: "Objectifs et attentes",
      fields: [
        { name: "expectedImpact", label: "Quel serait l'impact attendu sur votre productivité ?", placeholder: "ex: Gain de temps, réduction des erreurs, amélioration de la réactivité", required: true },
        { name: "expectedGains", label: "Quels gains attendez-vous (en temps, coûts, qualité) ?", placeholder: "ex: Réduction de 50% du temps de traitement" },
        { name: "priorities", label: "Priorités en matière d'automatisation", placeholder: "ex: ROI rapide, facilité d'implémentation, scalabilité" }
      ]
    },
    {
      title: "Informations complémentaires",
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

  const isCurrentSectionValid = () => {
    const currentFields = sections[currentSection].fields;
    const requiredFields = currentFields.filter(field => field.required);

    return requiredFields.every(field => {
      const value = form.getValues(field.name);
      return value && value.trim() !== "";
    });
  };

  const handleNext = () => {
    if (isCurrentSectionValid()) {
      setCurrentSection(prev => prev + 1);
    } else {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires avant de continuer.",
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const params = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          params.append(key, value.toString());
        }
      });

      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

      console.log('Tentative d\'envoi vers webhook:', webhookUrl);
      
      try {
        const response = await fetch(`${webhookUrl}?${params.toString()}`, {
          method: 'GET',
        }).then(async response => {
          const text = await response.text();
          console.log('Réponse webhook:', response.status, text);
          return { response, text };
        });

        if (!response.response.ok) {
          throw new Error(`Erreur lors de l\'envoi du formulaire: ${response.response.status}: ${response.text}`);
        }
      } catch (fetchError) {
        console.error('Erreur de fetch:', fetchError);
        throw fetchError;
      }

      toast({
        title: "Formulaire envoyé avec succès !",
        description: "Nous vous contacterons rapidement avec des solutions personnalisées.",
      });

      form.reset();
      setCurrentSection(0);

    } catch (error) {
      console.error('Erreur détaillée:', error);
      // Afficher plus de détails pour le débogage
      if (error instanceof Error) {
        console.error('Message d\'erreur:', error.message);
        console.error('Stack trace:', error.stack);
      }
      
      // Loguer les données qui auraient dû être envoyées
      console.log('Données du formulaire:', data);
      console.log('URL webhook:', import.meta.env.VITE_N8N_WEBHOOK_URL || 'Non définie');
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du formulaire. Consultez la console pour plus de détails.",
      });
    }
  };

  const progress = ((currentSection + 1) / sections.length) * 100;

  const renderField = (field: any) => {
    if (field.type === "select" && field.options) {
      return (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel className="text-gray-200">
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
          <FormItem>
            <FormLabel className="text-gray-200">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <Input
                {...formField}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
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
      <div className="relative z-[2] container mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
        <Link href="/" className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors">
          ← Retour
        </Link>

        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">
          Générateur d'Automatisations Personnalisées
        </h1>

        <div className="mb-8">
          <Progress value={progress} className="w-full h-2 bg-gray-700" />
          <p className="text-center mt-2 text-sm text-gray-400">
            Section {currentSection + 1} sur {sections.length} : {sections[currentSection].title}
          </p>
        </div>

        <Card className="p-6 max-w-2xl mx-auto bg-gray-800/50 border-gray-700">
          <Form {...form}>
            <form className="space-y-6">
              <div className="space-y-4">
                {sections[currentSection].fields.map(renderField)}
              </div>

              <div className="flex justify-between mt-6">
                {currentSection > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentSection(prev => prev - 1)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Précédent
                  </Button>
                )}

                {currentSection < sections.length - 1 ? (
                  <Button
                    type="button"
                    className={`${currentSection === 0 ? "w-full" : "ml-auto"} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white`}
                    onClick={handleNext}
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="ml-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={!isCurrentSectionValid()}
                  >
                    Recevoir mes automatisations personnalisées
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}