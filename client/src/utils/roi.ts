import { addDays } from 'date-fns'

export const DEV_DAYS = 20 // temps de développement moyen

export type Frequency = 'daily' | 'weekly' | 'monthly'
export type SalaryMode = 'hourly' | 'monthly' | 'annual'

export interface RoiCalculationInput {
  taskHours: number // Durée de la tâche en heures
  frequency: Frequency // Fréquence d'exécution
  salaryMode: SalaryMode // Mode d'affichage du salaire
  hourlyNet?: number // Salaire horaire net
  monthlyNet?: number // Salaire mensuel net
  annualBrut?: number // Salaire annuel brut
  employees: number // Nombre d'employés
  cost: number // Coût de l'automatisation
}

export interface RoiCalculationOutput {
  hourlyNet: number // Salaire horaire net (calculé)
  monthlyNet: number // Salaire mensuel net (calculé)
  annualBrut: number // Salaire annuel brut (calculé)
  hoursYearly: number // Heures économisées par an
  hoursMonthly: number // Heures économisées par mois
  savingsYearly: number // Économies financières par an
  savingsMonthly: number // Économies financières par mois
  roiPercentage: number // ROI en pourcentage
  monthsToBreakeven: number // Mois avant rentabilité
  daysToBreakeven: number // Jours avant rentabilité
  profitableDate: Date // Date de rentabilité
}

const HOURS_PER_MONTH = 151.67
const NET_TO_BRUT_RATIO = 0.757
const DAYS_PER_MONTH = 30.44

// Constantes pour les fréquences d'exécution
const FREQUENCY_MULTIPLIERS = {
  daily: 252, // Jours ouvrés par an
  weekly: 52, // Semaines par an
  monthly: 12, // Mois par an
}

// Convertir entre les différents formats de salaire
export function convertSalary({
  salaryMode,
  hourlyNet,
  monthlyNet,
  annualBrut,
}: Pick<RoiCalculationInput, 'salaryMode' | 'hourlyNet' | 'monthlyNet' | 'annualBrut'>): Pick<
  RoiCalculationOutput,
  'hourlyNet' | 'monthlyNet' | 'annualBrut'
> {
  let calculatedMonthlyNet: number
  let calculatedHourlyNet: number
  let calculatedAnnualBrut: number

  switch (salaryMode) {
    case 'hourly':
      if (hourlyNet === undefined) throw new Error('Hourly net salary required')
      calculatedMonthlyNet = hourlyNet * HOURS_PER_MONTH
      calculatedHourlyNet = hourlyNet
      calculatedAnnualBrut = (calculatedMonthlyNet / NET_TO_BRUT_RATIO) * 12
      break
    case 'monthly':
      if (monthlyNet === undefined) throw new Error('Monthly net salary required')
      calculatedMonthlyNet = monthlyNet
      calculatedHourlyNet = monthlyNet / HOURS_PER_MONTH
      calculatedAnnualBrut = (monthlyNet / NET_TO_BRUT_RATIO) * 12
      break
    case 'annual':
      if (annualBrut === undefined) throw new Error('Annual brut salary required')
      calculatedMonthlyNet = (annualBrut * NET_TO_BRUT_RATIO) / 12
      calculatedHourlyNet = calculatedMonthlyNet / HOURS_PER_MONTH
      calculatedAnnualBrut = annualBrut
      break
    default:
      throw new Error('Invalid salary mode')
  }

  return {
    hourlyNet: calculatedHourlyNet,
    monthlyNet: calculatedMonthlyNet,
    annualBrut: calculatedAnnualBrut,
  }
}

// Calculer le ROI
export function calculateRoi(input: RoiCalculationInput): RoiCalculationOutput {
  // Convertir les salaires
  const { hourlyNet, monthlyNet, annualBrut } = convertSalary(input)

  // Calculer les heures économisées
  const freqPerYear = FREQUENCY_MULTIPLIERS[input.frequency]
  const hoursYearly = input.taskHours * freqPerYear * input.employees
  const hoursMonthly = hoursYearly / 12

  // Calculer les économies financières
  const savingsYearly = hoursYearly * hourlyNet
  const savingsMonthly = savingsYearly / 12

  // Calculer le ROI
  const roiPercentage = ((savingsYearly - input.cost) / input.cost) * 100
  const monthsToBreakeven = input.cost / savingsMonthly
  const daysToBreakeven = monthsToBreakeven * DAYS_PER_MONTH

  // Calculer la date de rentabilité
  const profitableDate = addDays(new Date(), DEV_DAYS + Math.round(daysToBreakeven))

  return {
    hourlyNet,
    monthlyNet,
    annualBrut,
    hoursYearly,
    hoursMonthly,
    savingsYearly,
    savingsMonthly,
    roiPercentage,
    monthsToBreakeven,
    daysToBreakeven,
    profitableDate,
  }
}

// Valeurs par défaut pour la France
export const DEFAULT_MONTHLY_NET_SALARY = 2735 // Moyenne en France (€)
