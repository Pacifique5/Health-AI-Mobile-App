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
      symptoms: ['fever', 'cough', 'headache', 'body aches', 'fatigue', 'sore throat'],
      description: 'Influenza (flu) is a contagious respiratory illness caused by influenza viruses.',
      medications: ['Acetaminophen', 'Ibuprofen', 'Oseltamivir (Tamiflu)'],
      procedures: ['Rest', 'Stay hydrated', 'Monitor temperature'],
      precautions: ['Wash hands frequently', 'Avoid close contact with sick people', 'Get flu vaccine'],
      specialist: 'General Practitioner',
    },
    {
      name: 'Common Cold',
      symptoms: ['runny nose', 'sneezing', 'cough', 'sore throat', 'mild headache'],
      description: 'The common cold is a viral infection of the upper respiratory tract.',
      medications: ['Decongestants', 'Pain relievers', 'Cough syrup'],
      procedures: ['Rest', 'Drink plenty of fluids', 'Use humidifier'],
      precautions: ['Wash hands regularly', 'Avoid touching face', 'Stay home when sick'],
      specialist: 'General Practitioner',
    },
    {
      name: 'Migraine',
      symptoms: ['severe headache', 'nausea', 'sensitivity to light', 'visual disturbances'],
      description: 'Migraine is a neurological condition characterized by intense, debilitating headaches.',
      medications: ['Triptans', 'NSAIDs', 'Anti-nausea medications'],
      procedures: ['Rest in dark room', 'Apply cold compress', 'Avoid triggers'],
      precautions: ['Identify triggers', 'Maintain regular sleep', 'Manage stress'],
      specialist: 'Neurologist',
    },
    {
      name: 'Gastroenteritis',
      symptoms: ['stomach pain', 'nausea', 'vomiting', 'diarrhea', 'fever'],
      description: 'Gastroenteritis is inflammation of the digestive tract, often caused by infection.',
      medications: ['Oral rehydration solution', 'Anti-diarrheal medication', 'Probiotics'],
      procedures: ['Stay hydrated', 'Eat bland foods', 'Rest'],
      precautions: ['Wash hands thoroughly', 'Avoid contaminated food/water', 'Practice food safety'],
      specialist: 'Gastroenterologist',
    },
    {
      name: 'Hypertension',
      symptoms: ['chest pain', 'shortness of breath', 'headache', 'dizziness', 'blurred vision'],
      description: 'High blood pressure is a condition where blood pressure is consistently elevated.',
      medications: ['ACE inhibitors', 'Beta blockers', 'Diuretics'],
      procedures: ['Monitor blood pressure', 'Lifestyle modifications', 'Regular check-ups'],
      precautions: ['Reduce sodium intake', 'Exercise regularly', 'Maintain healthy weight'],
      specialist: 'Cardiologist',
    },
  ];

  async analyzeSymptoms(symptomsInput: string) {
    const normalizedInput = symptomsInput.toLowerCase().trim();
    
    // Check for greetings
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    if (greetings.some(greeting => normalizedInput.includes(greeting))) {
      return {
        message: 'Hello! How can I help you today? Please describe your symptoms.',
      };
    }

    // Parse symptoms
    const inputSymptoms = normalizedInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (inputSymptoms.length === 0) {
      throw new Error('Please provide at least one symptom');
    }

    // Find matching disease
    let bestMatch: Disease | null = null;
    let maxMatches = 0;

    for (const disease of this.diseases) {
      let matches = 0;
      for (const symptom of inputSymptoms) {
        if (disease.symptoms.some(ds => ds.includes(symptom) || symptom.includes(ds))) {
          matches++;
        }
      }
      
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = disease;
      }
    }

    if (!bestMatch || maxMatches === 0) {
      throw new Error('No matching disease found. Please try different or more specific symptoms.');
    }

    // Format response
    const message = `✅ Possible Disease: ${bestMatch.name}
📄 Description: ${bestMatch.description}
💊 Medications: ${bestMatch.medications.join(', ')}
🛠️ Procedures: ${bestMatch.procedures.join(', ')}
🧼 Precautions: ${bestMatch.precautions.join(', ')}
👨‍⚕️ Specialist to Consult: ${bestMatch.specialist}`;

    return { message };
  }
}
