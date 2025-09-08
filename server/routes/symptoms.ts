import { RequestHandler } from "express";
import type { AdvancedSymptomCheckInput, AdvancedSymptomCheckResult, SymptomCheckResult, TriageLevel } from "@shared/api";

// Google AI Integration
const GOOGLE_AI_API_KEY = "AIzaSyAaj3wyYkCk-oo1m9TvnbG7bWcn_Yg1J74";
const GOOGLE_AI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

interface GoogleAIRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
  generationConfig: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  };
  safetySettings: {
    category: string;
    threshold: string;
  }[];
}

interface GoogleAIResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
    safetyRatings: any[];
  }[];
}

// Enhanced symptoms database
const COMPREHENSIVE_SYMPTOMS = [
  // Basic symptoms
  { key: "fever", label: "Fever", severity: "moderate", category: "general" },
  { key: "cough", label: "Cough", severity: "mild", category: "respiratory" },
  { key: "breath", label: "Difficulty breathing", severity: "high", category: "respiratory" },
  { key: "chest_pain", label: "Chest pain", severity: "high", category: "cardiovascular" },
  { key: "headache", label: "Headache", severity: "mild", category: "neurological" },
  { key: "nausea", label: "Nausea", severity: "mild", category: "gastrointestinal" },
  { key: "vomiting", label: "Vomiting", severity: "moderate", category: "gastrointestinal" },
  { key: "diarrhea", label: "Diarrhea", severity: "moderate", category: "gastrointestinal" },
  { key: "fatigue", label: "Extreme fatigue", severity: "mild", category: "general" },
  { key: "dizziness", label: "Dizziness", severity: "moderate", category: "neurological" },
  
  // Advanced symptoms
  { key: "abdominal_pain", label: "Abdominal pain", severity: "moderate", category: "gastrointestinal" },
  { key: "back_pain", label: "Back pain", severity: "mild", category: "musculoskeletal" },
  { key: "joint_pain", label: "Joint pain", severity: "mild", category: "musculoskeletal" },
  { key: "skin_rash", label: "Skin rash", severity: "mild", category: "dermatological" },
  { key: "sore_throat", label: "Sore throat", severity: "mild", category: "respiratory" },
  { key: "runny_nose", label: "Runny nose", severity: "mild", category: "respiratory" },
  { key: "loss_smell", label: "Loss of smell/taste", severity: "moderate", category: "neurological" },
  { key: "muscle_aches", label: "Muscle aches", severity: "mild", category: "musculoskeletal" },
  { key: "confusion", label: "Confusion", severity: "high", category: "neurological" },
  { key: "vision_changes", label: "Vision changes", severity: "high", category: "neurological" },
  { key: "difficulty_swallowing", label: "Difficulty swallowing", severity: "moderate", category: "gastrointestinal" },
  { key: "palpitations", label: "Heart palpitations", severity: "moderate", category: "cardiovascular" },
  { key: "sweating", label: "Excessive sweating", severity: "mild", category: "general" },
  { key: "weight_loss", label: "Unexplained weight loss", severity: "moderate", category: "general" },
  { key: "bloody_stool", label: "Blood in stool", severity: "high", category: "gastrointestinal" },
  { key: "difficulty_urinating", label: "Difficulty urinating", severity: "moderate", category: "genitourinary" },
];

// Advanced triage logic
function performAdvancedTriage(input: AdvancedSymptomCheckInput): SymptomCheckResult {
  const symptoms = new Set(input.symptoms);
  const redFlags: string[] = [];
  const recommendations: string[] = [];
  let triageLevel: TriageLevel = "self_care";
  let advice = "Monitor symptoms and rest.";
  let followUpInDays = 7;

  // Critical symptoms check
  const criticalSymptoms = ["chest_pain", "breath", "confusion", "bloody_stool", "vision_changes"];
  const emergencySymptoms = criticalSymptoms.filter(s => symptoms.has(s));
  
  if (emergencySymptoms.length > 0) {
    triageLevel = "emergency";
    advice = "Seek immediate emergency care. Call emergency services.";
    redFlags.push(...emergencySymptoms.map(s => COMPREHENSIVE_SYMPTOMS.find(cs => cs.key === s)?.label || s));
    followUpInDays = 0;
  }

  // Age-based risk factors
  if (input.age > 65) {
    if (symptoms.has("fever") || symptoms.has("cough") || symptoms.has("breath")) {
      redFlags.push("Advanced age with respiratory symptoms");
      if (triageLevel === "self_care") {
        triageLevel = "doctor";
        advice = "Consult a doctor due to age-related risk factors.";
        followUpInDays = 2;
      }
    }
  }

  if (input.age < 2) {
    if (symptoms.has("fever") || symptoms.has("vomiting") || symptoms.has("diarrhea")) {
      redFlags.push("Infant with concerning symptoms");
      triageLevel = "doctor";
      advice = "Young children require prompt medical evaluation.";
      followUpInDays = 1;
    }
  }

  // Combination symptoms analysis
  if (symptoms.has("fever") && symptoms.has("cough") && symptoms.has("breath")) {
    triageLevel = "doctor";
    advice = "Combination of respiratory symptoms requires medical evaluation.";
    redFlags.push("Respiratory symptom cluster");
    followUpInDays = 2;
  }

  if (symptoms.has("headache") && symptoms.has("fever") && symptoms.has("confusion")) {
    triageLevel = "emergency";
    advice = "Possible serious infection. Seek immediate medical care.";
    redFlags.push("Possible meningitis symptoms");
    followUpInDays = 0;
  }

  // Severity-based escalation
  if (input.severity && input.severity >= 8) {
    if (triageLevel === "self_care") {
      triageLevel = "doctor";
      advice = "High severity symptoms warrant medical evaluation.";
      followUpInDays = 1;
    }
  }

  // Duration considerations
  if (input.duration && input.duration.includes("week")) {
    recommendations.push("Persistent symptoms lasting over a week should be evaluated");
    if (triageLevel === "self_care") {
      triageLevel = "pharmacist";
      followUpInDays = 3;
    }
  }

  // Self-care recommendations
  if (triageLevel === "self_care") {
    if (symptoms.has("fever")) {
      recommendations.push("Use fever-reducing medications as directed");
      recommendations.push("Stay hydrated with plenty of fluids");
    }
    if (symptoms.has("cough")) {
      recommendations.push("Consider honey or throat lozenges");
      recommendations.push("Use a humidifier if available");
    }
    if (symptoms.has("headache")) {
      recommendations.push("Rest in a quiet, dark room");
      recommendations.push("Apply cold or warm compress");
    }
  }

  return {
    level: triageLevel,
    advice,
    redFlags,
    recommendations,
    followUpInDays,
    confidence: 0.8 // Basic triage confidence
  };
}

async function getAIAnalysis(input: AdvancedSymptomCheckInput): Promise<Partial<AdvancedSymptomCheckResult>> {
  try {
    const prompt = `You are a medical AI assistant helping with symptom triage. Analyze the following patient information and provide a structured medical assessment:

Patient Information:
- Age: ${input.age}
- Gender: ${input.gender || 'not specified'}
- Symptoms: ${input.symptoms.join(', ')}
- Duration: ${input.duration || 'not specified'}
- Severity (1-10): ${input.severity || 'not specified'}
- Additional notes: ${input.notes || 'none'}
- Medical history: ${input.medicalHistory?.join(', ') || 'none'}

Please provide:
1. Top 3 possible conditions with probability percentages
2. Critical warning signs to watch for
3. Specific recommendations
4. Urgency level (self_care, pharmacist, doctor, urgent, emergency)
5. Preventive measures

Format your response as structured text that can be parsed. Be conservative in your assessment and always err on the side of caution. This is for triage purposes only and not a substitute for professional medical diagnosis.`;

    const requestBody: GoogleAIRequest = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 1024
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch(`${GOOGLE_AI_ENDPOINT}?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.status}`);
    }

    const data: GoogleAIResponse = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse AI response (basic parsing - could be enhanced)
    return {
      aiAnalysis: aiText,
      confidence: 0.9,
      // Could parse specific sections from AI response here
      possibleConditions: extractConditions(aiText),
      criticalSigns: extractCriticalSigns(aiText),
      preventiveMeasures: extractPreventiveMeasures(aiText)
    };

  } catch (error) {
    console.error('AI Analysis failed:', error);
    return {
      aiAnalysis: 'AI analysis unavailable. Using basic triage only.',
      confidence: 0.6
    };
  }
}

// Helper functions to parse AI response
function extractConditions(text: string): string[] {
  const matches = text.match(/(?:possible conditions?|diagnosis|differential)[:\s]*([^.]*)/i);
  if (matches) {
    return matches[1].split(',').map(c => c.trim()).filter(c => c.length > 0);
  }
  return [];
}

function extractCriticalSigns(text: string): string[] {
  const matches = text.match(/(?:warning signs?|critical|red flags?)[:\s]*([^.]*)/i);
  if (matches) {
    return matches[1].split(',').map(c => c.trim()).filter(c => c.length > 0);
  }
  return [];
}

function extractPreventiveMeasures(text: string): string[] {
  const matches = text.match(/(?:preventive|prevention|avoid)[:\s]*([^.]*)/i);
  if (matches) {
    return matches[1].split(',').map(c => c.trim()).filter(c => c.length > 0);
  }
  return [];
}

export const handleSymptomCheck: RequestHandler = async (req, res) => {
  try {
    const input = req.body as AdvancedSymptomCheckInput;
    
    // Input validation
    if (!input.age || !Array.isArray(input.symptoms) || input.symptoms.length === 0) {
      return res.status(400).json({ error: 'Invalid input: age and symptoms are required' });
    }

    // Perform basic triage first
    let result = performAdvancedTriage(input) as AdvancedSymptomCheckResult;

    // If AI analysis is requested and available
    if (input.useAI) {
      const aiResult = await getAIAnalysis(input);
      result = { ...result, ...aiResult };
    }

    res.json(result);
  } catch (error) {
    console.error('Symptom check error:', error);
    res.status(500).json({ error: 'Internal server error during symptom analysis' });
  }
};

export const getSymptomsList: RequestHandler = (req, res) => {
  res.json({ symptoms: COMPREHENSIVE_SYMPTOMS });
};