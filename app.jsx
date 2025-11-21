import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, AlertCircle, ShoppingCart, Clock, Activity, Users, ShieldAlert, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/lib/customSupabaseClient';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
function App() {
  const [symptoms, setSymptoms] = useState('');
  const [history, setHistory] = useState([]);
  const [currentDiagnosis, setCurrentDiagnosis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const {
    toast
  } = useToast();
  const {
    user
  } = useSupabaseAuth();

  // Load history from Supabase on mount or when user changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setHistory([]);
        setIsLoadingHistory(false);
        return;
      }
      try {
        const {
          data,
          error
        } = await supabase.from('symptom_checks').select('*').order('created_at', {
          ascending: false
        });
        if (error) throw error;
        setHistory(data || []);
      } catch (error) {
        console.error('Error loading history:', error);
        toast({
          title: "Error loading history",
          description: "Could not fetch your previous symptom checks.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [user, toast]);

  // Function to generate CVS search URL
  const getCVSLink = medicineName => {
    const encodedName = encodeURIComponent(medicineName);
    return `https://www.cvs.com/search?searchTerm=${encodedName}`;
  };

  // Detailed information for each condition
  const conditionDetails = {
    'Tension Headache': {
      description: 'The most common type of headache, causing mild to moderate pain that feels like a tight band around your head. Stress and muscle tension are common triggers.',
      danger: 'Low',
      contagious: false
    },
    'Migraine': {
      description: 'A potent headache that can cause severe throbbing pain or a pulsing sensation, usually on one side of the head. It is often accompanied by nausea, vomiting, and extreme sensitivity to light and sound.',
      danger: 'Moderate',
      contagious: false
    },
    'Dehydration': {
      description: 'A condition caused by losing more fluid than you take in. It can lead to headaches, dizziness, and fatigue.',
      danger: 'Moderate',
      contagious: false
    },
    'Common Cold': {
      description: 'A viral infection of your nose and throat (upper respiratory tract). It is usually harmless, although it might not feel that way.',
      danger: 'Low',
      contagious: true
    },
    'Flu': {
      description: 'Influenza is a viral infection that attacks your respiratory system. For most people, the flu resolves on its own, but sometimes its complications can be deadly.',
      danger: 'Moderate',
      contagious: true
    },
    'Viral Infection': {
      description: 'A general term for an infection caused by a virus. Symptoms vary widely depending on the specific virus and the body system involved.',
      danger: 'Moderate',
      contagious: true
    },
    'Bronchitis': {
      description: 'Inflammation of the lining of your bronchial tubes, which carry air to and from your lungs. It often causes a persistent cough with mucus.',
      danger: 'Moderate',
      contagious: true
    },
    'Allergies': {
      description: 'An immune system response to a foreign substance that is not typically harmful to your body, such as pollen, pet dander, or certain foods.',
      danger: 'Low',
      contagious: false
    },
    'Pharyngitis': {
      description: 'Inflammation of the pharynx, which is in the back of the throat. It is most often referred to simply as a sore throat.',
      danger: 'Low',
      contagious: true
    },
    'Strep Throat': {
      description: 'A bacterial infection that can make your throat feel sore and scratchy. Untreated strep throat can lead to complications like kidney inflammation or rheumatic fever.',
      danger: 'Moderate',
      contagious: true
    },
    'Gastroenteritis': {
      description: 'An intestinal infection marked by watery diarrhea, abdominal cramps, nausea or vomiting, and sometimes fever. Often called the "stomach flu".',
      danger: 'Moderate',
      contagious: true
    },
    'Food Poisoning': {
      description: 'Illness caused by eating contaminated food. Infectious organisms or their toxins are the most common causes.',
      danger: 'Moderate',
      contagious: false
    },
    'Motion Sickness': {
      description: 'A disturbance of the inner ear caused by repeated motion, leading to nausea and dizziness.',
      danger: 'Low',
      contagious: false
    },
    'Sinusitis': {
      description: 'A condition in which the cavities around the nasal passages become inflamed. It can be acute (short-term) or chronic.',
      danger: 'Low',
      contagious: false
    },
    'Indigestion': {
      description: 'Discomfort or pain in the upper abdomen, often after eating or drinking. It is not a disease but a symptom of other digestive problems.',
      danger: 'Low',
      contagious: false
    },
    'Gastritis': {
      description: 'Inflammation of the protective lining of the stomach. It can occur suddenly (acute) or develop slowly over time (chronic).',
      danger: 'Moderate',
      contagious: false
    },
    'IBS': {
      description: 'Irritable Bowel Syndrome is a common disorder that affects the large intestine. Signs and symptoms include cramping, abdominal pain, bloating, gas, and diarrhea or constipation.',
      danger: 'Low',
      contagious: false
    },
    'Seasonal Allergies': {
      description: 'Also known as hay fever, this causes cold-like signs and symptoms, such as a runny nose, itchy eyes, congestion, sneezing and sinus pressure.',
      danger: 'Low',
      contagious: false
    },
    'Hay Fever': {
      description: 'An allergic response to outdoor or indoor allergens, such as pollen, dust mites, or tiny flecks of skin and saliva shed by cats, dogs, and other animals with fur or feathers.',
      danger: 'Low',
      contagious: false
    },
    'Allergic Rhinitis': {
      description: 'Diagnosis associated with a group of symptoms affecting the nose. These symptoms occur when you breathe in something you are allergic to, such as dust, animal dander, or pollen.',
      danger: 'Low',
      contagious: false
    },
    'Muscle Strain': {
      description: 'An injury to a muscle or a tendon — the fibrous tissue that connects muscles to bones. Minor injuries may only overstretch a muscle or tendon, while more severe injuries may involve partial or complete tears.',
      danger: 'Low',
      contagious: false
    },
    'Overexertion': {
      description: 'The state of being physically or mentally pushed beyond one\'s limits. It is a common cause of muscle pain and fatigue.',
      danger: 'Low',
      contagious: false
    },
    'Fibromyalgia': {
      description: 'A disorder characterized by widespread musculoskeletal pain accompanied by fatigue, sleep, memory and mood issues.',
      danger: 'Moderate',
      contagious: false
    }
  };

  // Symptom database with diagnoses and recommendations
  const symptomDatabase = {
    'headache': {
      diagnoses: ['Tension Headache', 'Migraine', 'Dehydration'],
      medicines: [{
        name: 'Ibuprofen (Advil)',
        link: getCVSLink('Ibuprofen (Advil)'),
        description: 'Pain reliever and anti-inflammatory'
      }, {
        name: 'Acetaminophen (Tylenol)',
        link: getCVSLink('Acetaminophen (Tylenol)'),
        description: 'Pain reliever and fever reducer'
      }, {
        name: 'Aspirin',
        link: getCVSLink('Aspirin'),
        description: 'Pain reliever'
      }]
    },
    'fever': {
      diagnoses: ['Common Cold', 'Flu', 'Viral Infection'],
      medicines: [{
        name: 'Acetaminophen (Tylenol)',
        link: getCVSLink('Acetaminophen (Tylenol)'),
        description: 'Fever reducer and pain reliever'
      }, {
        name: 'Ibuprofen (Advil)',
        link: getCVSLink('Ibuprofen (Advil)'),
        description: 'Fever reducer and anti-inflammatory'
      }]
    },
    'cough': {
      diagnoses: ['Common Cold', 'Bronchitis', 'Allergies'],
      medicines: [{
        name: 'Dextromethorphan (Robitussin)',
        link: getCVSLink('Dextromethorphan (Robitussin)'),
        description: 'Cough suppressant'
      }, {
        name: 'Guaifenesin (Mucinex)',
        link: getCVSLink('Guaifenesin (Mucinex)'),
        description: 'Expectorant for chest congestion'
      }, {
        name: 'Honey & Lemon Throat Lozenges',
        link: getCVSLink('Honey & Lemon Throat Lozenges'),
        description: 'Soothes throat irritation'
      }]
    },
    'sore throat': {
      diagnoses: ['Pharyngitis', 'Common Cold', 'Strep Throat'],
      medicines: [{
        name: 'Throat Lozenges',
        link: getCVSLink('Throat Lozenges'),
        description: 'Soothes throat pain'
      }, {
        name: 'Chloraseptic Spray',
        link: getCVSLink('Chloraseptic Spray'),
        description: 'Numbing throat spray'
      }, {
        name: 'Ibuprofen (Advil)',
        link: getCVSLink('Ibuprofen (Advil)'),
        description: 'Reduces inflammation and pain'
      }]
    },
    'nausea': {
      diagnoses: ['Gastroenteritis', 'Food Poisoning', 'Motion Sickness'],
      medicines: [{
        name: 'Bismuth Subsalicylate (Pepto-Bismol)',
        link: getCVSLink('Bismuth Subsalicylate (Pepto-Bismol)'),
        description: 'Relieves nausea and upset stomach'
      }, {
        name: 'Dramamine',
        link: getCVSLink('Dramamine'),
        description: 'Motion sickness relief'
      }, {
        name: 'Ginger Chews',
        link: getCVSLink('Ginger Chews'),
        description: 'Natural nausea relief'
      }]
    },
    'congestion': {
      diagnoses: ['Common Cold', 'Sinusitis', 'Allergies'],
      medicines: [{
        name: 'Pseudoephedrine (Sudafed)',
        link: getCVSLink('Pseudoephedrine (Sudafed)'),
        description: 'Nasal decongestant'
      }, {
        name: 'Oxymetazoline (Afrin)',
        link: getCVSLink('Oxymetazoline (Afrin)'),
        description: 'Nasal spray decongestant'
      }, {
        name: 'Saline Nasal Spray',
        link: getCVSLink('Saline Nasal Spray'),
        description: 'Natural congestion relief'
      }]
    },
    'stomach ache': {
      diagnoses: ['Indigestion', 'Gastritis', 'IBS'],
      medicines: [{
        name: 'Antacids (Tums)',
        link: getCVSLink('Antacids (Tums)'),
        description: 'Neutralizes stomach acid'
      }, {
        name: 'Famotidine (Pepcid)',
        link: getCVSLink('Famotidine (Pepcid)'),
        description: 'Reduces stomach acid production'
      }, {
        name: 'Simethicone (Gas-X)',
        link: getCVSLink('Simethicone (Gas-X)'),
        description: 'Relieves gas and bloating'
      }]
    },
    'diarrhea': {
      diagnoses: ['Gastroenteritis', 'Food Poisoning', 'IBS'],
      medicines: [{
        name: 'Loperamide (Imodium)',
        link: getCVSLink('Loperamide (Imodium)'),
        description: 'Anti-diarrheal medication'
      }, {
        name: 'Bismuth Subsalicylate (Pepto-Bismol)',
        link: getCVSLink('Bismuth Subsalicylate (Pepto-Bismol)'),
        description: 'Treats diarrhea and upset stomach'
      }, {
        name: 'Electrolyte Solution (Pedialyte)',
        link: getCVSLink('Electrolyte Solution (Pedialyte)'),
        description: 'Prevents dehydration'
      }]
    },
    'allergies': {
      diagnoses: ['Seasonal Allergies', 'Hay Fever', 'Allergic Rhinitis'],
      medicines: [{
        name: 'Cetirizine (Zyrtec)',
        link: getCVSLink('Cetirizine (Zyrtec)'),
        description: 'Antihistamine for allergies'
      }, {
        name: 'Loratadine (Claritin)',
        link: getCVSLink('Loratadine (Claritin)'),
        description: 'Non-drowsy allergy relief'
      }, {
        name: 'Fexofenadine (Allegra)',
        link: getCVSLink('Fexofenadine (Allegra)'),
        description: '24-hour allergy relief'
      }]
    },
    'muscle pain': {
      diagnoses: ['Muscle Strain', 'Overexertion', 'Fibromyalgia'],
      medicines: [{
        name: 'Ibuprofen (Advil)',
        link: getCVSLink('Ibuprofen (Advil)'),
        description: 'Anti-inflammatory pain reliever'
      }, {
        name: 'Naproxen (Aleve)',
        link: getCVSLink('Naproxen (Aleve)'),
        description: 'Long-lasting pain relief'
      }, {
        name: 'Topical Pain Relief Cream',
        link: getCVSLink('Topical Pain Relief Cream'),
        description: 'Topical muscle pain relief'
      }]
    }
  };
  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Please enter symptoms",
        description: "Enter your symptoms to get a diagnosis",
        variant: "destructive"
      });
      return;
    }
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your symptom history.",
        variant: "destructive"
      });
      return;
    }
    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(async () => {
      const symptomsLower = symptoms.toLowerCase();
      let matchedDiagnoses = new Set();
      let matchedMedicines = [];

      // Check for matching symptoms
      Object.keys(symptomDatabase).forEach(symptom => {
        if (symptomsLower.includes(symptom)) {
          symptomDatabase[symptom].diagnoses.forEach(d => matchedDiagnoses.add(d));
          matchedMedicines.push(...symptomDatabase[symptom].medicines);
        }
      });

      // Remove duplicate medicines
      const uniqueMedicines = Array.from(new Map(matchedMedicines.map(m => [m.name, m])).values());
      let finalDiagnoses = Array.from(matchedDiagnoses);
      if (finalDiagnoses.length === 0) {
        finalDiagnoses = ['Unable to determine'];
      }
      const diagnosisData = {
        user_id: user.id,
        symptoms: symptoms,
        diagnoses: finalDiagnoses,
        medicines: uniqueMedicines,
        created_at: new Date().toISOString()
      };
      try {
        const {
          data,
          error
        } = await supabase.from('symptom_checks').insert([diagnosisData]).select().single();
        if (error) throw error;
        setCurrentDiagnosis(data);
        setHistory(prev => [data, ...prev]);
        toast({
          title: "Analysis Complete",
          description: `Found ${finalDiagnoses.length} possible diagnosis${finalDiagnoses.length !== 1 ? 'es' : ''}`
        });
      } catch (error) {
        console.error('Error saving diagnosis:', error);
        toast({
          title: "Error saving results",
          description: "Your analysis was complete but couldn't be saved to history.",
          variant: "destructive"
        });
        // Still show results even if save failed
        setCurrentDiagnosis({
          ...diagnosisData,
          id: 'temp-id'
        });
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);
  };
  const deleteHistoryItem = async id => {
    if (!user) return;
    try {
      const {
        error
      } = await supabase.from('symptom_checks').delete().eq('id', id);
      if (error) throw error;
      setHistory(prev => prev.filter(item => item.id !== id));
      if (currentDiagnosis?.id === id) {
        setCurrentDiagnosis(null);
      }
      toast({
        title: "Deleted",
        description: "History entry removed"
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error deleting",
        description: "Could not remove the history entry.",
        variant: "destructive"
      });
    }
  };
  const viewHistoryItem = item => {
    setCurrentDiagnosis(item);
    setSymptoms(item.symptoms);
  };
  const formatDate = timestamp => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getDangerColor = level => {
    switch (level) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Moderate':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  return <>
      <Helmet>
        <title>Symptom Checker - Get Quick Health Insights</title>
        <meta name="description" content="Check your symptoms and get possible diagnoses with recommended over-the-counter medicines. Professional health guidance at your fingertips." />
      </Helmet>

      <div className="min-h-screen bg-white flex">
        {/* Sidebar */}
        <motion.aside initial={{
        x: -300
      }} animate={{
        x: 0
      }} className="w-80 bg-gradient-to-b from-red-50 to-rose-50 border-r border-red-100 p-6 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-800">History</h2>
          </div>

          {isLoadingHistory ? <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-red-400 animate-spin" />
            </div> : history.length === 0 ? <p className="text-gray-500 text-sm text-center mt-8">No history yet. Start by checking your symptoms!</p> : <div className="space-y-3">
              <AnimatePresence>
                {history.map(item => <motion.div key={item.id} initial={{
              opacity: 0,
              y: -10
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              x: -100
            }} className={`bg-white rounded-lg p-4 shadow-sm border border-red-100 cursor-pointer hover:shadow-md transition-all ${currentDiagnosis?.id === item.id ? 'ring-2 ring-red-500' : ''}`} onClick={() => viewHistoryItem(item)}>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2 flex-1">
                        {item.symptoms}
                      </p>
                      <button onClick={e => {
                  e.stopPropagation();
                  deleteHistoryItem(item.id);
                }} className="ml-2 text-red-400 hover:text-red-700 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">{formatDate(item.created_at)}</p>
                    {item.diagnoses && item.diagnoses.length > 0 && <p className="text-xs text-red-600 mt-1">
                        {item.diagnoses.length} diagnosis{item.diagnoses.length !== 1 ? 'es' : ''}
                      </p>}
                  </motion.div>)}
              </AnimatePresence>
            </div>}
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Symptom Smart</h1>
              <p className="text-gray-600">Describe your symptoms to get possible diagnoses and treatment recommendations</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 max-w-2xl mx-auto">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>This tool provides general information only. Always consult a healthcare professional for medical advice.</span>
              </div>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-xl shadow-lg border border-red-100 p-6 mb-8">
              <label htmlFor="symptoms" className="block text-sm font-semibold text-gray-700 mb-3">
                Enter Your Symptoms
              </label>
              <textarea id="symptoms" value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="e.g., headache, fever, cough, sore throat..." className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-400" onKeyDown={e => {
              if (e.key === 'Enter' && e.ctrlKey) {
                analyzeSymptoms();
              }
            }} />
              <div className="flex justify-between items-center mt-4">
                <p className="text-xs text-gray-500">Press Ctrl+Enter to analyze</p>
                <Button onClick={analyzeSymptoms} disabled={isAnalyzing} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2">
                  {isAnalyzing ? <>
                      <motion.div animate={{
                    rotate: 360
                  }} transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Analyzing...
                    </> : <>
                      <Search className="w-4 h-4 mr-2" />
                      Analyze Symptoms
                    </>}
                </Button>
              </div>
            </div>

            {/* Results Section */}
            <AnimatePresence>
              {currentDiagnosis && <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} className="space-y-6">
                  {/* Possible Diagnoses */}
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-lg border border-red-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-red-600" />
                      Possible Diagnoses
                    </h2>
                    <div className="space-y-4">
                      {currentDiagnosis.diagnoses.map((diagnosisName, index) => {
                    const details = conditionDetails[diagnosisName] || {
                      description: 'No detailed description available.',
                      danger: 'Unknown',
                      contagious: false
                    };
                    return <motion.div key={index} initial={{
                      opacity: 0,
                      x: -20
                    }} animate={{
                      opacity: 1,
                      x: 0
                    }} transition={{
                      delay: index * 0.1
                    }} className="bg-white rounded-lg p-5 shadow-sm border border-red-100">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">{diagnosisName}</h3>
                              <div className="flex flex-wrap gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDangerColor(details.danger)} flex items-center gap-1`}>
                                  <ShieldAlert className="w-3 h-3" />
                                  {details.danger} Risk
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${details.contagious ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                                  <Users className="w-3 h-3" />
                                  {details.contagious ? 'Contagious' : 'Not Contagious'}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed flex items-start gap-2">
                              <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              {details.description}
                            </p>
                          </motion.div>;
                  })}
                    </div>
                  </div>

                  {/* Recommended Medicines */}
                  {currentDiagnosis.medicines.length > 0 && <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl shadow-lg border border-gray-200 p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6 text-red-600" />
                        Recommended OTC Medicines
                      </h2>
                      <div className="grid gap-4 md:grid-cols-2">
                        {currentDiagnosis.medicines.map((medicine, index) => <motion.div key={index} initial={{
                    opacity: 0,
                    scale: 0.9
                  }} animate={{
                    opacity: 1,
                    scale: 1
                  }} transition={{
                    delay: index * 0.1
                  }} className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow hover:border-red-200 group">
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors">{medicine.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{medicine.description}</p>
                            <a href={medicine.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
                              <ShoppingCart className="w-4 h-4" />
                              Purchase on CVS
                            </a>
                          </motion.div>)}
                      </div>
                    </div>}
                </motion.div>}
            </AnimatePresence>

            {/* Empty State */}
            {!currentDiagnosis && !isAnalyzing && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Enter your symptoms above to get started</p>
              </motion.div>}
          </motion.div>
        </main>

        <Toaster />
      </div>
    </>;
}
export default App;
