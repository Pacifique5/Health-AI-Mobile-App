import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface GreetingData {
  greeting: string;
  response: string;
}

interface DiseaseSymptomData {
  disease: string;
  symptoms: string[];
}

interface SymptomSeverity {
  symptom: string;
  weight: number;
}

interface DiseaseDescription {
  disease: string;
  description: string;
}

interface DiseaseTreatment {
  disease: string;
  medications: string;
  procedures: string;
  specialist: string;
}

interface DiseasePrecaution {
  disease: string;
  precautions: string[];
}

@Injectable()
export class EnhancedSymptomService {
  private greetings: GreetingData[] = [];
  private diseaseSymptoms: DiseaseSymptomData[] = [];
  private symptomWeights: Map<string, number> = new Map();
  private diseaseDescriptions: Map<string, string> = new Map();
  private diseaseTreatments: Map<string, DiseaseTreatment> = new Map();
  private diseasePrecautions: Map<string, string[]> = new Map();

  constructor() {
    this.loadAllData();
  }

  private loadAllData() {
    try {
      this.loadGreetings();
      this.loadDiseaseSymptoms();
      this.loadSymptomWeights();
      this.loadDiseaseDescriptions();
      this.loadDiseaseTreatments();
      this.loadDiseasePrecautions();
      console.log('✅ All medical data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading medical data:', error);
    }
  }

  private loadGreetings() {
    const filePath = path.join(__dirname, '../../data/greetings.csv');
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').slice(1); // Skip header
    
    this.greetings = lines
      .filter(line => line.trim())
      .map(line => {
        const [greeting, response] = line.split(',');
        return { greeting: greeting?.trim(), response: response?.trim() };
      })
      .filter(item => item.greeting && item.response);
  }

  private loadDiseaseSymptoms() {
    const filePath = path.join(__dirname, '../../data/DiseaseAndSymptoms.csv');
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').slice(1); // Skip header
    
    const diseaseMap = new Map<string, Set<string>>();
    
    lines.forEach(line => {
      if (!line.trim()) return;
      
      const parts = line.split(',');
      const disease = parts[0]?.trim();
      if (!disease) return;
      
      const symptoms = parts.slice(1)
        .map(s => s?.trim())
        .filter(s => s && s !== '')
        .map(s => s.toLowerCase().replace(/[_\s]+/g, ' ').trim());
      
      if (!diseaseMap.has(disease)) {
        diseaseMap.set(disease, new Set());
      }
      
      symptoms.forEach(symptom => {
        if (symptom) {
          diseaseMap.get(disease)!.add(symptom);
        }
      });
    });
    
    this.diseaseSymptoms = Array.from(diseaseMap.entries()).map(([disease, symptomsSet]) => ({
      disease,
      symptoms: Array.from(symptomsSet)
    }));
  }

  private loadSymptomWeights() {
    const filePath = path.join(__dirname, '../../data/Symptom-severity.csv');
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').slice(1); // Skip header
    
    lines.forEach(line => {
      if (!line.trim()) return;
      
      const [symptom, weight] = line.split(',');
      if (symptom && weight) {
        const normalizedSymptom = symptom.trim().toLowerCase().replace(/[_\s]+/g, ' ');
        this.symptomWeights.set(normalizedSymptom, parseInt(weight.trim()) || 1);
      }
    });
  }

  private loadDiseaseDescriptions() {
    const filePath = path.join(__dirname, '../../data/symptom_Description.csv');
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').slice(1); // Skip header
    
    lines.forEach(line => {
      if (!line.trim()) return;
      
      const commaIndex = line.indexOf(',');
      if (commaIndex === -1) return;
      
      const disease = line.substring(0, commaIndex).trim();
      const description = line.substring(commaIndex + 1).trim().replace(/"/g, '');
      
      if (disease && description) {
        this.diseaseDescriptions.set(disease.toLowerCase(), description);
      }
    });
  }

  private loadDiseaseTreatments() {
    const filePath = path.join(__dirname, '../../data/disease_treatments.csv');
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').slice(1); // Skip header
    
    lines.forEach(line => {
      if (!line.trim()) return;
      
      const parts = line.split(',');
      if (parts.length >= 4) {
        const disease = parts[0]?.trim();
        const medications = parts[1]?.trim().replace(/"/g, '');
        const procedures = parts[2]?.trim().replace(/"/g, '');
        const specialist = parts[3]?.trim().replace(/"/g, '');
        
        if (disease) {
          this.diseaseTreatments.set(disease.toLowerCase(), {
            disease,
            medications: medications || 'Consult healthcare provider for appropriate medications',
            procedures: procedures || 'Follow medical advice and regular monitoring',
            specialist: specialist || 'General Practitioner or relevant specialist'
          });
        }
      }
    });
  }

  private loadDiseasePrecautions() {
    const filePath = path.join(__dirname, '../../data/Disease precaution.csv');
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').slice(1); // Skip header
    
    lines.forEach(line => {
      if (!line.trim()) return;
      
      const parts = line.split(',');
      const disease = parts[0]?.trim();
      if (!disease) return;
      
      const precautions = parts.slice(1)
        .map(p => p?.trim())
        .filter(p => p && p !== '');
      
      if (precautions.length > 0) {
        this.diseasePrecautions.set(disease.toLowerCase(), precautions);
      }
    });
  }

  async analyzeSymptoms(symptomsInput: string) {
    const normalizedInput = symptomsInput.toLowerCase().trim();
    
    // Check for greetings first
    const greetingResponse = this.checkForGreeting(normalizedInput);
    if (greetingResponse) {
      return { message: greetingResponse };
    }

    // Parse symptoms
    const inputSymptoms = this.parseSymptoms(normalizedInput);
    
    if (inputSymptoms.length === 0) {
      return {
        message: 'Please provide at least 3 symptoms separated by commas for accurate analysis.\n\nExample: fever, cough, headache\n\nThis helps me provide more precise health insights and recommendations.'
      };
    }

    if (inputSymptoms.length < 3) {
      return {
        message: `You provided ${inputSymptoms.length} symptom${inputSymptoms.length === 1 ? '' : 's'}: ${inputSymptoms.join(', ')}\n\nFor accurate analysis, please provide at least 3 symptoms separated by commas.\n\nExample: fever, cough, headache, body aches`
      };
    }

    // Find matching disease using advanced scoring
    const bestMatch = this.findBestDiseaseMatch(inputSymptoms);
    
    if (!bestMatch) {
      return {
        message: 'I couldn\'t find a specific match for your symptoms. Please try describing your symptoms more specifically or consult with a healthcare professional for proper evaluation.'
      };
    }

    // Generate comprehensive response
    return this.generateDiseaseResponse(bestMatch.disease, bestMatch.score, inputSymptoms);
  }

  private checkForGreeting(input: string): string | null {
    // Check for greeting matches - exact match or contains the greeting
    for (const greeting of this.greetings) {
      const greetingLower = greeting.greeting.toLowerCase();
      
      // Exact match
      if (input === greetingLower) {
        return greeting.response;
      }
      
      // Input starts with greeting
      if (input.startsWith(greetingLower + ' ') || 
          input.startsWith(greetingLower + ',') ||
          input.startsWith(greetingLower + '.')) {
        return greeting.response;
      }
      
      // Input ends with greeting
      if (input.endsWith(' ' + greetingLower) || 
          input.endsWith(',' + greetingLower) ||
          input.endsWith('.' + greetingLower)) {
        return greeting.response;
      }
      
      // For multi-word greetings, check if the full greeting is contained
      if (greetingLower.includes(' ') && input.includes(greetingLower)) {
        return greeting.response;
      }
    }
    return null;
  }

  private parseSymptoms(input: string): string[] {
    return input
      .split(/[,;]/)
      .map(s => s.trim().toLowerCase())
      .map(s => s.replace(/[_\s]+/g, ' ').trim())
      .filter(s => s.length > 0);
  }

  private findBestDiseaseMatch(inputSymptoms: string[]): { disease: string; score: number } | null {
    let bestMatch: { disease: string; score: number } | null = null;
    let maxScore = 0;

    for (const diseaseData of this.diseaseSymptoms) {
      const score = this.calculateDiseaseScore(inputSymptoms, diseaseData.symptoms);
      
      if (score > maxScore && score > 0) {
        maxScore = score;
        bestMatch = { disease: diseaseData.disease, score };
      }
    }

    return bestMatch;
  }

  private calculateDiseaseScore(inputSymptoms: string[], diseaseSymptoms: string[]): number {
    let totalScore = 0;
    let matchCount = 0;

    for (const inputSymptom of inputSymptoms) {
      let bestSymptomScore = 0;
      
      for (const diseaseSymptom of diseaseSymptoms) {
        const similarity = this.calculateSymptomSimilarity(inputSymptom, diseaseSymptom);
        if (similarity > 0.6) { // Threshold for considering a match
          const weight = this.symptomWeights.get(diseaseSymptom) || 1;
          const symptomScore = similarity * weight;
          bestSymptomScore = Math.max(bestSymptomScore, symptomScore);
        }
      }
      
      if (bestSymptomScore > 0) {
        totalScore += bestSymptomScore;
        matchCount++;
      }
    }

    // Bonus for multiple symptom matches
    if (matchCount > 1) {
      totalScore *= (1 + (matchCount - 1) * 0.2);
    }

    return totalScore;
  }

  private calculateSymptomSimilarity(symptom1: string, symptom2: string): number {
    // Exact match
    if (symptom1 === symptom2) return 1.0;
    
    // Contains match
    if (symptom1.includes(symptom2) || symptom2.includes(symptom1)) return 0.9;
    
    // Word overlap
    const words1 = symptom1.split(' ');
    const words2 = symptom2.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    
    if (commonWords.length > 0) {
      return commonWords.length / Math.max(words1.length, words2.length);
    }
    
    // Levenshtein distance for fuzzy matching
    return this.levenshteinSimilarity(symptom1, symptom2);
  }

  private levenshteinSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private generateDiseaseResponse(disease: string, score: number, inputSymptoms: string[]) {
    const diseaseKey = disease.toLowerCase();
    
    // Get data from loaded CSV files
    const description = this.diseaseDescriptions.get(diseaseKey) || 
      `${disease} is a medical condition that requires proper evaluation and treatment.`;
    
    const treatment = this.diseaseTreatments.get(diseaseKey);
    const precautions = this.diseasePrecautions.get(diseaseKey) || [];
    
    const medications = treatment?.medications || 'Consult healthcare provider for appropriate medications';
    const procedures = treatment?.procedures || 'Follow medical advice and regular monitoring';
    const specialist = treatment?.specialist || 'General Practitioner or relevant specialist';
    
    const precautionText = precautions.length > 0 
      ? precautions.join(', ')
      : 'Follow general health precautions and consult healthcare provider';

    // Calculate confidence level
    const confidence = Math.min(Math.round((score / 10) * 100), 95);
    
    const message = `✅ Possible Condition: ${disease} (${confidence}% match)
📄 Description: ${description}
💊 Medications: ${medications}
🛠️ Procedures: ${procedures}
🧼 Precautions: ${precautionText}
👨‍⚕️ Specialist to Consult: ${specialist}

⚠️ Important: This analysis is based on the symptoms you provided (${inputSymptoms.join(', ')}). Please consult with a qualified healthcare professional for proper diagnosis and treatment.`;

    return { message };
  }
}