import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const PriceCalculator = () => {
  // Déclarer les états pour les inputs
  const [JT, setJT] = useState(218);
  const [S, setS] = useState(10000);
  const [P_alea_vie, setP_alea_vie] = useState(0.9);
  const [P_arret, setP_arret] = useState(0.8);
  const [P_produit, setP_produit] = useState(0.5);
  const [DIRECT_COST, setDIRECT_COST] = useState(150);
  const [MSP1, setMSP1] = useState(70000);
  const [MSP2, setMSP2] = useState(70000);
  const [P, setP] = useState(0.5);
  const [NSP1, setNSP1] = useState(1);
  const [NJ, setNJ] = useState(2);

  // Déclarer les états pour les outputs
  const [prix_par_concept, setPrixParConcept] = useState(null);
  const [c1, setC1] = useState(null);
  const [token, setToken] = useState(null);

  const calculatePrice = () => {
    // Calculer les valeurs intermédiaires
    const MS = MSP1 + MSP2 + S * 12;
    const nbr_jour_salarie = NSP1 * JT * P_alea_vie * P_arret;
    const nbr_jour_total = JT * P * P_alea_vie + nbr_jour_salarie;
    const nbr_jour_total_1 = nbr_jour_total * P_produit;
    const n1 = nbr_jour_total_1 / NJ;
    const direct_cost_year = DIRECT_COST * 12;
    const CC = MS * 0.4;
    const CF = CC + MS;
    const total_cost = CF * P_produit + direct_cost_year;

    // Calculer le prix par concept
    const prix_par_concept_calculated = total_cost / n1;
    setPrixParConcept(prix_par_concept_calculated);

    // Calculer le nombre de produits réalisables par mois
    const c1_calculated = n1 / 12; // Remplacer 12 par N_MOIS si N_MOIS est une variable
    setC1(c1_calculated);

    // Envoyer les données à Google Sheets
    sendDataToSheet({
      JT,
      S,
      P_alea_vie,
      P_arret,
      P_produit,
      DIRECT_COST,
      MSP1,
      MSP2,
      P,
      NSP1,
      NJ,
      prix_par_concept_calculated,
      c1_calculated
    });
  };

  const sendDataToSheet = async (data) => {
    if (!token) {
      console.error('No OAuth token available');
      return;
    }

    try {
      const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/19Kj14DyW7WAvBvIz-c6RsPefEBmTPHZ65qlw5yhVv-E/values/Bruno!A1:append', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          //range: 'Bruno!A1',
          //valueInputOption: 'RAW',
          //insertDataOption: 'INSERT_ROWS',
          values: [
            [
"hello","paris"
            ]
          ]
        }),
      });

      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Login Success:', tokenResponse);
      setToken(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  });

  return (

      <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row items-center justify-center w-full gap-4">
        <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-6">Calculateur de Prix par Concept</h1>
          <div className="space-y-4">
            {/* Google Login */}
            <button onClick={() => login()} className="bg-blue-500 text-white px-4 py-2 rounded">
              Login with Google
            </button>

            {/* Form Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de jours travaillé dans la boîte dans un an (JT)</label>
              <input
                type="number"
                value={JT}
                onChange={(e) => setJT(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Salaire mensuel d’un dirigeant (S)</label>
              <input
                type="number"
                value={S}
                onChange={(e) => setS(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pourcentage représentant le nombre de jours travaillés en tenant en compte les aléas de la vie (P_alea_vie)</label>
              <input
                type="number"
                value={P_alea_vie}
                onChange={(e) => setP_alea_vie(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pourcentage représentant les arrêts maladies liés aux salariés (P_arret)</label>
              <input
                type="number"
                value={P_arret}
                onChange={(e) => setP_arret(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pourcentage passé sur un produit 1 développé par la boîte (P_produit)</label>
              <input
                type="number"
                value={P_produit}
                onChange={(e) => setP_produit(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Coût direct par mois (DIRECT_COST)</label>
              <input
                type="number"
                value={DIRECT_COST}
                onChange={(e) => setDIRECT_COST(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Somme des salaires brut annuels des salariés à l’exception du dirigeant ayant travaillé sur le produit 1 (MSP1)</label>
              <input
                type="number"
                value={MSP1}
                onChange={(e) => setMSP1(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Somme des salaires brut annuels des salariés à l’exception du dirigeant ne travaillant pas sur le produit 1 (MSP2)</label>
              <input
                type="number"
                value={MSP2}
                onChange={(e) => setMSP2(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pourcentage passé sur le produit 1 (P)</label>
              <input
                type="number"
                value={P}
                onChange={(e) => setP(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de salariés ayant travaillé sur le produit 1 (NSP1)</label>
              <input
                type="number"
                value={NSP1}
                onChange={(e) => setNSP1(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de jours travaillé par le dirigeant (NJ)</label>
              <input
                type="number"
                value={NJ}
                onChange={(e) => setNJ(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <button
            onClick={calculatePrice}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Calculer le prix
          </button>

          {prix_par_concept !== null && (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Résultats</h2>
              <p>Prix par concept: {prix_par_concept.toFixed(2)}</p>
              <p>Nombre de produits réalisables par mois: {c1.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>
  );
};

export default PriceCalculator;
