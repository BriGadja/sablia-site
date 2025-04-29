import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Calculator, 
  Clock, 
  Calendar, 
  Users, 
  Euro, 
  TrendingUp, 
  Info,
  Sparkles,
  CalendarDays
} from 'lucide-react';
import { 
  calculateRoi, 
  Frequency, 
  SalaryMode, 
  DEFAULT_MONTHLY_NET_SALARY,
  DEV_DAYS
} from '@/utils/roi';

// Convertit les heures en format lisible (ex: 1.5h -> 1h 30min)
const formatHours = (hours: number) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
};

// Formate les valeurs monétaires
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
};

// Formate les valeurs monétaires avec 2 décimales max
const formatCurrencyWithDecimals = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
  }).format(value);
};

// Formate les pourcentages
const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    maximumFractionDigits: 0
  }).format(value / 100);
};

// Échelle linéaire avec des paliers de 30 minutes, de 0h à 8h
// La plage va de 0 à 480 minutes (0 à 8h)
const sliderToHours = (value: number) => {
  // Convertir de minutes (0-480) en heures (0-8)
  return value / 60;
};

// Convertit les heures en valeur du slider (minutes)
const hoursToSlider = (hours: number) => {
  // Convertir les heures en minutes et arrondir à un multiple de 30 le plus proche
  const minutes = Math.round(hours * 60 / 30) * 30;
  // S'assurer que la valeur est dans la plage valide (0-480 minutes)
  return Math.max(0, Math.min(480, minutes));
};

// Étiquettes pour le slider - affichage uniquement aux points spécifiés
const sliderMarks = [
  { value: 0, label: '0h' },    // 0 minutes
  { value: 120, label: '2h' },  // 120 minutes
  { value: 240, label: '4h' },  // 240 minutes
  { value: 360, label: '6h' },  // 360 minutes
  { value: 480, label: '8h' }   // 480 minutes
];

const RoiCalculator: React.FC = () => {
  // États du formulaire
  const [sliderValue, setSliderValue] = useState(hoursToSlider(2)); // 2h par défaut
  const [taskHours, setTaskHours] = useState(2);
  const [frequency, setFrequency] = useState<Frequency>('daily'); // Quotidienne par défaut
  const [salaryMode, setSalaryMode] = useState<SalaryMode>('monthly');
  const [hourlyNet, setHourlyNet] = useState<number | undefined>(undefined);
  const [monthlyNet, setMonthlyNet] = useState<number>(DEFAULT_MONTHLY_NET_SALARY);
  const [annualBrut, setAnnualBrut] = useState<number | undefined>(undefined);
  const [employees, setEmployees] = useState(2); // 2 employés par défaut
  const [cost, setCost] = useState(5000);
  
  // État pour les résultats du calcul
  const [results, setResults] = useState<any>(null);
  
  // Fonction debounce pour limiter les calculs
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  
  // Fonction pour arrondir à 2 décimales
  const roundToTwoDecimals = (value: number): number => {
    return Math.round(value * 100) / 100;
  };

  // Synchronise les différents formats de salaire
  const syncSalary = useCallback((
    mode: SalaryMode, 
    hourly?: number, 
    monthly?: number, 
    annual?: number
  ) => {
    if (mode === 'hourly' && hourly !== undefined) {
      const hourlyRounded = roundToTwoDecimals(hourly);
      const monthlyCalculated = roundToTwoDecimals(hourlyRounded * 151.67);
      const annualCalculated = roundToTwoDecimals((hourlyRounded * 151.67 / 0.757) * 12);
      
      setHourlyNet(hourlyRounded);
      setMonthlyNet(monthlyCalculated);
      setAnnualBrut(annualCalculated);
    } else if (mode === 'monthly' && monthly !== undefined) {
      const monthlyRounded = roundToTwoDecimals(monthly);
      const hourlyCalculated = roundToTwoDecimals(monthlyRounded / 151.67);
      const annualCalculated = roundToTwoDecimals((monthlyRounded / 0.757) * 12);
      
      setHourlyNet(hourlyCalculated);
      setMonthlyNet(monthlyRounded);
      setAnnualBrut(annualCalculated);
    } else if (mode === 'annual' && annual !== undefined) {
      const annualRounded = roundToTwoDecimals(annual);
      const monthlyCalculated = roundToTwoDecimals((annualRounded * 0.757) / 12);
      const hourlyCalculated = roundToTwoDecimals(monthlyCalculated / 151.67);
      
      setHourlyNet(hourlyCalculated);
      setMonthlyNet(monthlyCalculated);
      setAnnualBrut(annualRounded);
    }
  }, []);
  
  // Mettre à jour les résultats
  const updateResults = useCallback(debounce(() => {
    try {
      const input = {
        taskHours,
        frequency,
        salaryMode,
        hourlyNet,
        monthlyNet,
        annualBrut,
        employees,
        cost
      };
      
      const calculationResults = calculateRoi(input);
      setResults(calculationResults);
    } catch (error) {
      console.error("Erreur de calcul ROI:", error);
    }
  }, 300), [taskHours, frequency, salaryMode, hourlyNet, monthlyNet, annualBrut, employees, cost]);
  
  // Lancer le calcul à chaque changement d'entrée
  useEffect(() => {
    updateResults();
  }, [taskHours, frequency, employees, cost, hourlyNet, monthlyNet, annualBrut, updateResults]);
  
  // Initialiser les salaires
  useEffect(() => {
    syncSalary('monthly', undefined, DEFAULT_MONTHLY_NET_SALARY);
  }, [syncSalary]);
  
  // Mise à jour du slider
  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    setSliderValue(newValue);
    setTaskHours(sliderToHours(newValue));
  };
  
  // Déterminer la classe CSS pour le ROI en fonction de sa valeur
  const getRoiColorClass = (percentage: number) => {
    if (percentage < 0) return 'text-red-500';
    if (percentage < 100) return 'text-amber-500';
    if (percentage < 200) return 'text-emerald-500';
    return 'text-blue-500';
  };
  
  return (
    <motion.section 
      id="roi-calculator"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-60 bg-pattern"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Calculez votre <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">retour sur investissement</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Estimez rapidement les économies réalisées grâce à l'automatisation de vos tâches répétitives
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Formulaire d'entrée */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <Card className="backdrop-blur-lg bg-gray-800/40 border border-gray-700 shadow-xl rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-400" />
                  Paramètres de la tâche
                </h3>
                
                {/* Durée de la tâche */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-white flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      Durée actuelle de la tâche: <span className="font-bold text-blue-400 ml-2">{formatHours(taskHours)}</span>
                    </Label>
                  </div>
                  
                  <div className="px-2">
                    <Slider
                      value={[sliderValue]}
                      min={0}
                      max={480}
                      step={30}
                      onValueChange={handleSliderChange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      {sliderMarks.map((mark) => (
                        <span key={mark.value}>{mark.label}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Fréquence */}
                <div className="mb-8">
                  <Label className="text-white flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    Fréquence d'exécution
                  </Label>
                  
                  <RadioGroup
                    value={frequency}
                    onValueChange={(value) => setFrequency(value as Frequency)}
                    className="grid grid-cols-3 gap-3"
                  >
                    <div className="flex items-center justify-center space-x-2 bg-gray-700/50 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-700 transition">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily" className="text-gray-200 cursor-pointer">Quotidienne</Label>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2 bg-gray-700/50 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-700 transition">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly" className="text-gray-200 cursor-pointer">Hebdomadaire</Label>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2 bg-gray-700/50 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-700 transition">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly" className="text-gray-200 cursor-pointer">Mensuelle</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Salaire */}
                <div className="mb-8">
                  <Label className="text-white flex items-center gap-2 mb-3">
                    <Euro className="h-4 w-4 text-blue-400" />
                    Salaire
                  </Label>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <Button
                      variant={salaryMode === 'hourly' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSalaryMode('hourly')}
                      className={salaryMode === 'hourly' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-0' : ''}
                    >
                      Horaire net
                    </Button>
                    
                    <Button
                      variant={salaryMode === 'monthly' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSalaryMode('monthly')}
                      className={salaryMode === 'monthly' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-0' : ''}
                    >
                      Mensuel net
                    </Button>
                    
                    <Button
                      variant={salaryMode === 'annual' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSalaryMode('annual')}
                      className={salaryMode === 'annual' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-0' : ''}
                    >
                      Annuel brut
                    </Button>
                  </div>
                  
                  <div className="mb-3">
                    {salaryMode === 'hourly' && (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={hourlyNet?.toString() || ''}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value) && value >= 0) {
                              syncSalary('hourly', value);
                            }
                          }}
                          className="bg-gray-700/50 border-gray-600 text-white"
                          placeholder="Salaire horaire net"
                        />
                        <span className="text-gray-300">€/h</span>
                      </div>
                    )}
                    
                    {salaryMode === 'monthly' && (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={monthlyNet?.toString() || ''}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value) && value >= 0) {
                              syncSalary('monthly', undefined, value);
                            }
                          }}
                          className="bg-gray-700/50 border-gray-600 text-white"
                          placeholder="Salaire mensuel net"
                        />
                        <span className="text-gray-300">€/mois</span>
                      </div>
                    )}
                    
                    {salaryMode === 'annual' && (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={annualBrut?.toString() || ''}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value) && value >= 0) {
                              syncSalary('annual', undefined, undefined, value);
                            }
                          }}
                          className="bg-gray-700/50 border-gray-600 text-white"
                          placeholder="Salaire annuel brut"
                        />
                        <span className="text-gray-300">€/an</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-400 italic">
                    {salaryMode !== 'hourly' && (
                      <p>Salaire horaire équivalent: <span className="text-blue-400">{formatCurrencyWithDecimals(hourlyNet || 0)}/h</span></p>
                    )}
                    {salaryMode !== 'monthly' && (
                      <p>Salaire mensuel équivalent: <span className="text-blue-400">{formatCurrencyWithDecimals(monthlyNet || 0)}/mois</span></p>
                    )}
                    {salaryMode !== 'annual' && (
                      <p>Salaire annuel équivalent: <span className="text-blue-400">{formatCurrencyWithDecimals(annualBrut || 0)}/an</span></p>
                    )}
                  </div>
                </div>
                
                {/* Nombre d'employés */}
                <div className="mb-8 text-center">
                  <Label className="text-white flex items-center justify-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-blue-400" />
                    Nombre d'employés effectuant cette tâche
                  </Label>
                  
                  <div className="flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEmployees(Math.max(1, employees - 1))}
                      disabled={employees <= 1}
                      className="rounded-r-none h-10"
                    >
                      -
                    </Button>
                    <div className="w-20 text-center rounded-none bg-gray-700/50 border border-gray-600 text-white h-10 flex items-center justify-center">
                      <span className="text-white font-medium">{employees}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEmployees(employees + 1)}
                      className="rounded-l-none h-10"
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                {/* Coût d'automatisation */}
                <div className="mb-4">
                  <Label className="text-white flex items-center gap-2 mb-3">
                    <Euro className="h-4 w-4 text-blue-400" />
                    Coût estimé de l'automatisation
                  </Label>
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={cost}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && value >= 0) {
                          setCost(value);
                        }
                      }}
                      className="bg-gray-700/50 border-gray-600 text-white"
                      placeholder="Coût en euros"
                    />
                    <span className="text-gray-300">€</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Résultats */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full"
          >
            {results && (
              <div className="space-y-6">
                {/* Économies par an/mois */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Par an */}
                  <Card className="border border-gray-700 shadow-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md hover:shadow-blue-500/10 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <CardContent className="p-6 relative">
                      <h4 className="text-lg font-semibold mb-3 text-gray-200">Par an</h4>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Heures économisées:</span>
                          <span className="text-blue-400 font-bold">{formatHours(results.hoursYearly)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Économies financières:</span>
                          <span className="text-green-400 font-bold">{formatCurrency(results.savingsYearly)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Par mois */}
                  <Card className="border border-gray-700 shadow-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md hover:shadow-purple-500/10 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <CardContent className="p-6 relative">
                      <h4 className="text-lg font-semibold mb-3 text-gray-200">Par mois</h4>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Heures économisées:</span>
                          <span className="text-purple-400 font-bold">{formatHours(results.hoursMonthly)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Économies financières:</span>
                          <span className="text-green-400 font-bold">{formatCurrency(results.savingsMonthly)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Rentabilité */}
                <Card className="border border-gray-700 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-gray-800/80 to-gray-900/90 relative">
                  <div className="absolute inset-0 bg-dots-pattern opacity-30"></div>
                  
                  <div className="p-6 relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-5 w-5 text-cyan-400" />
                      <h3 className="text-xl font-bold text-white">Rentabilité</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* ROI */}
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-400">ROI</h4>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-900 text-gray-200 border-gray-700">
                                <p className="max-w-xs">Retour sur investissement</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className={`text-2xl font-bold ${getRoiColorClass(results.roiPercentage)}`}>
                          {formatPercentage(results.roiPercentage)}
                        </p>
                      </div>
                      
                      {/* Temps avant rentabilité */}
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-400">Temps avant rentabilité</h4>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-900 text-gray-200 border-gray-700">
                                <p className="max-w-xs">Temps nécessaire pour que les économies dépassent l'investissement</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className="text-2xl font-bold text-amber-400">
                          {results.monthsToBreakeven.toFixed(1)} mois
                        </p>
                      </div>
                      
                      {/* Date de rentabilité */}
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-400">Date de rentabilité</h4>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs bg-gray-900 text-gray-200 border-gray-700">
                                <p>Date à laquelle votre investissement sera rentabilisé (inclut 20 jours de développement)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-blue-400" />
                          <p className="text-xl font-bold text-white">
                            {results.profitableDate instanceof Date && !isNaN(results.profitableDate.getTime()) 
                              ? format(results.profitableDate, 'dd MMM yyyy', { locale: fr })
                              : "Calcul en cours..."}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 mb-6">
                      <Info className="h-5 w-5 text-blue-400 mr-2 shrink-0" />
                      <p className="text-sm text-blue-200">
                        Estimation basée sur {DEV_DAYS} jours de développement moyen et vos données
                      </p>
                    </div>
                    
                    <a
                      href="https://calendly.com/brice-gachadoat/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block text-center py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 group"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="h-5 w-5 text-white group-hover:animate-pulse" />
                        Déployer mon automatisation et commencer à économiser !
                      </span>
                    </a>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default RoiCalculator;