import { Injectable } from '@nestjs/common';

interface Disease {
  name: string;
  symptoms: string[];
  description: string;
  medications: string[];
  procedures: string[];
  precautions: string[];
  specialist: string;
}

@Injectable()
export class SymptomService {
  private diseases: Disease[] = [
    {
      name: 'Flu',
      symptoms: ['fever', 'cough', 'headache', 'body aches', 'fatigue', 'sore throat', 'runny nose'],
      description: 'Influenza (flu) is a contagious respiratory illness caused by influenza viruses that infect the nose, throat, and sometimes the lungs.',
      medications: ['Acetaminophen (Tylenol)', 'Ibuprofen (Advil)', 'Oseltamivir (Tamiflu)', 'Rest and fluids'],
      procedures: ['Get plenty of rest', 'Stay hydrated with fluids', 'Monitor temperature regularly', 'Isolate to prevent spread'],
      precautions: ['Wash hands frequently with soap', 'Avoid close contact with sick people', 'Get annual flu vaccine', 'Cover coughs and sneezes'],
      specialist: 'General Practitioner or Family Medicine Doctor',
    },
    {
      name: 'Common Cold',
      symptoms: ['runny nose', 'sneezing', 'cough', 'sore throat', 'mild headache', 'congestion'],
      description: 'The common cold is a viral infection of the upper respiratory tract that is usually harmless but can make you feel miserable.',
      medications: ['Decongestants', 'Pain relievers (acetaminophen, ibuprofen)', 'Cough syrup', 'Throat lozenges'],
      procedures: ['Rest and sleep', 'Drink plenty of fluids', 'Use humidifier', 'Gargle with salt water'],
      precautions: ['Wash hands regularly', 'Avoid touching face', 'Stay home when sick', 'Disinfect surfaces'],
      specialist: 'General Practitioner',
    },
    {
      name: 'Migraine',
      symptoms: ['severe headache', 'nausea', 'vomiting', 'sensitivity to light', 'sensitivity to sound', 'visual disturbances'],
      description: 'Migraine is a neurological condition characterized by intense, debilitating headaches often accompanied by nausea and sensitivity to light and sound.',
      medications: ['Triptans (Sumatriptan)', 'NSAIDs (Ibuprofen, Naproxen)', 'Anti-nausea medications', 'Preventive medications'],
      procedures: ['Rest in dark, quiet room', 'Apply cold compress to head', 'Avoid known triggers', 'Practice relaxation techniques'],
      precautions: ['Identify and avoid triggers', 'Maintain regular sleep schedule', 'Manage stress levels', 'Stay hydrated'],
      specialist: 'Neurologist or Headache Specialist',
    },
    {
      name: 'Gastroenteritis',
      symptoms: ['stomach pain', 'nausea', 'vomiting', 'diarrhea', 'fever', 'abdominal cramps'],
      description: 'Gastroenteritis is inflammation of the digestive tract, commonly caused by viral or bacterial infections, leading to stomach upset and digestive issues.',
      medications: ['Oral rehydration solution', 'Anti-diarrheal medication (if appropriate)', 'Probiotics', 'Electrolyte supplements'],
      procedures: ['Stay well hydrated', 'Eat bland, easy-to-digest foods', 'Rest and avoid solid foods initially', 'Gradual return to normal diet'],
      precautions: ['Wash hands thoroughly and frequently', 'Avoid contaminated food and water', 'Practice proper food safety', 'Avoid dairy temporarily'],
      specialist: 'Gastroenterologist or General Practitioner',
    },
    {
      name: 'Hypertension',
      symptoms: ['chest pain', 'shortness of breath', 'headache', 'dizziness', 'blurred vision', 'fatigue'],
      description: 'High blood pressure (hypertension) is a condition where blood pressure in the arteries is persistently elevated, increasing risk of heart disease and stroke.',
      medications: ['ACE inhibitors', 'Beta blockers', 'Diuretics', 'Calcium channel blockers'],
      procedures: ['Monitor blood pressure regularly', 'Lifestyle modifications', 'Regular medical check-ups', 'Weight management'],
      precautions: ['Reduce sodium intake', 'Exercise regularly', 'Maintain healthy weight', 'Limit alcohol consumption', 'Quit smoking'],
      specialist: 'Cardiologist or Internal Medicine Doctor',
    },
    {
      name: 'Anxiety Disorder',
      symptoms: ['excessive worry', 'restlessness', 'fatigue', 'difficulty concentrating', 'muscle tension', 'sleep problems'],
      description: 'Anxiety disorders involve excessive fear or worry that interferes with daily activities and can manifest in various physical and emotional symptoms.',
      medications: ['SSRIs (Sertraline, Escitalopram)', 'Benzodiazepines (short-term)', 'Beta blockers', 'Buspirone'],
      procedures: ['Cognitive behavioral therapy', 'Relaxation techniques', 'Regular exercise', 'Stress management'],
      precautions: ['Limit caffeine intake', 'Practice mindfulness', 'Maintain regular sleep schedule', 'Avoid alcohol and drugs'],
      specialist: 'Psychiatrist or Mental Health Counselor',
    },
    {
      name: 'Diabetes Type 2',
      symptoms: ['increased thirst', 'frequent urination', 'fatigue', 'blurred vision', 'slow healing wounds', 'weight loss'],
      description: 'Type 2 diabetes is a chronic condition affecting how the body processes blood sugar (glucose), often developing due to insulin resistance.',
      medications: ['Metformin', 'Insulin', 'Sulfonylureas', 'DPP-4 inhibitors'],
      procedures: ['Monitor blood glucose levels', 'Follow diabetic diet', 'Regular exercise', 'Foot care'],
      precautions: ['Maintain healthy diet', 'Regular physical activity', 'Monitor blood sugar', 'Regular medical check-ups'],
      specialist: 'Endocrinologist or Diabetes Specialist',
    }
  ];

  async analyzeSymptoms(symptomsInput: string) {
    const normalizedInput = symptomsInput.toLowerCase().trim();
    
    // Check for greetings - exactly like your web app
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'how are you'];
    if (greetings.some(greeting => normalizedInput.includes(greeting))) {
      return {
        message: 'Hello! How can I help you today? Please describe your symptoms and I\'ll provide you with possible conditions and recommendations.',
      };
    }

    // Parse symptoms
    const inputSymptoms = normalizedInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (inputSymptoms.length === 0) {
      throw new Error('Please provide at least one symptom separated by commas (e.g., fever, cough, headache)');
    }

    // Find matching disease using fuzzy matching
    let bestMatch: Disease | null = null;
    let maxScore = 0;

    for (const disease of this.diseases) {
      let score = 0;
      for (const symptom of inputSymptoms) {
        for (const diseaseSymptom of disease.symptoms) {
          // Exact match
          if (diseaseSymptom.includes(symptom) || symptom.includes(diseaseSymptom)) {
            score += 2;
          }
          // Partial match
          else if (this.calculateSimilarity(symptom, diseaseSymptom) > 0.7) {
            score += 1;
          }
        }
      }
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = disease;
      }
    }

    if (!bestMatch || maxScore === 0) {
      throw new Error('No matching disease found. Please try different or more specific symptoms. Examples: "fever, cough, headache" or "stomach pain, nausea"');
    }

    // Format response exactly like your web app
    const message = `✅ Possible Disease: ${bestMatch.name}
📄 Description: ${bestMatch.description}
💊 Medications: ${bestMatch.medications.join(', ')}
🛠️ Procedures: ${bestMatch.procedures.join(', ')}
🧼 Precautions: ${bestMatch.precautions.join(', ')}
👨‍⚕️ Specialist to Consult: ${bestMatch.specialist}`;

    return { message };
  }

  private calculateSimilarity(str1: string, str2: string): number {
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
}
