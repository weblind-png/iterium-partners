"use client";

import { useState, useRef } from "react";

export default function ExpertPage() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    linkedin: "",
    metier: "",
    experience: "",
    expertises: "",
    disponibilite: "",
    localisation: "", // Ce champ stockera désormais la région sélectionnée
    tjm: "",
  });

  const [interventionChoices, setInterventionChoices] = useState({
    teletravail: false,
    hybride: false,
    surSite: false,
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setInterventionChoices({
      ...interventionChoices,
      [e.target.name]: e.target.checked,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      const selectedInterventions = Object.keys(interventionChoices)
        .filter((key) => interventionChoices[key])
        .map((key) => {
          if (key === "teletravail") return "Télétravail";
          if (key === "hybride") return "Hybride";
          if (key === "surSite") return "Sur site";
          return key;
        })
        .join(", ");

      formData.append("intervention", selectedInterventions);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const res = await fetch("/api/contact-expert", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Votre candidature a bien été envoyée.");

        setForm({
          nom: "",
          email: "",
          telephone: "",
          linkedin: "",
          metier: "",
          experience: "",
          expertises: "",
          disponibilite: "",
          localisation: "",
          tjm: "",
        });
        setInterventionChoices({
          teletravail: false,
          hybride: false,
          surSite: false,
        });
        setPhotoFile(null);
        setPreviewUrl(null);
      } else {
        alert("Erreur lors de l’envoi.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur serveur.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A2942] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Rejoindre le réseau d’experts ITERIUM PARTNERS
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed">
            ITERIUM PARTNERS met en relation des PME, ETI et grands groupes
            avec des experts seniors immédiatement disponibles pour des missions
            stratégiques, ponctuelles ou de transition.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white text-slate-800 rounded-3xl p-8 shadow-2xl space-y-5"
        >

          <input
            type="text"
            name="nom"
            placeholder="Nom / Prénom"
            value={form.nom}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-xl p-4"
          />

          <input
            type="email"
            name="email"
            placeholder="Email professionnel"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-xl p-4"
          />

          <input
            type="text"
            name="telephone"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-4"
          />

          <input
            type="text"
            name="linkedin"
            placeholder="LinkedIn ou site professionnel"
            value={form.linkedin}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-4"
          />

          <input
            type="text"
            name="metier"
            placeholder="Fonction (DSI, CTO, DAF, RSSI...)"
            value={form.metier}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-xl p-4"
          />

          <textarea
            name="experience"
            placeholder="Résumé de votre parcours et expériences"
            rows="4"
            value={form.experience}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-xl p-4"
          />

          <textarea
            name="expertises"
            placeholder="Expertises clés (SAP, Azure, NIS2, Cloud, Finance...)"
            rows="3"
            value={form.expertises}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-xl p-4"
          />

          <div className="grid md:grid-cols-2 gap-4">
            
            {/* CHANGEMENT 2 : Liste déroulante des Régions & DOM-TOM */}
            <select
              name="localisation"
              value={form.localisation}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-xl p-4 bg-white text-slate-800 appearance-none cursor-pointer"
            >
              <option value="" disabled text-slate-400>Région principale de résidence</option>
              
              <g id="france-metropolitaine" label="France Métropolitaine">
                <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
                <option value="Bourgogne-Franche-Comté">Bourgogne-Franche-Comté</option>
                <option value="Bretagne">Bretagne</option>
                <option value="Centre-Val de Loire">Centre-Val de Loire</option>
                <option value="Corse">Corse</option>
                <option value="Grand Est">Grand Est</option>
                <option value="Hauts-de-France">Hauts-de-France</option>
                <option value="Île-de-France">Île-de-France</option>
                <option value="Normandie">Normandie</option>
                <option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</option>
                <option value="Occitanie">Occitanie</option>
                <option value="Pays de la Loire">Pays de la Loire</option>
                <option value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d'Azur</option>
              </g>

              <g id="dom-tom" label="DROM-COM / International">
                <option value="Guadeloupe">Guadeloupe</option>
                <option value="Guyane">Guyane</option>
                <option value="La Réunion">La Réunion</option>
                <option value="Martinique">Martinique</option>
                <option value="Mayotte">Mayotte</option>
                <option value="Nouvelle-Calédonie">Nouvelle-Calédonie</option>
                <option value="Polynésie française">Polynésie française</option>
                <option value="Saint-Barthélemy / Saint-Martin">Saint-Barthélemy / Saint-Martin</option>
                <option value="Saint-Pierre-et-Miquelon">Saint-Pierre-et-Miquelon</option>
                <option value="Wallis-et-Futuna">Wallis-et-Futuna</option>
                <option value="International / Autre">International / Étranger</option>
              </g>
            </select>

            <input
              type="text"
              name="disponibilite"
              placeholder="Disponibilité"
              value={form.disponibilite}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-4"
            />

            <input
              type="text"
              name="tjm"
              placeholder="TJM indicatif (€ / jour)"
              value={form.tjm}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl p-4"
            />

            <div className="border border-slate-300 rounded-xl p-4 flex flex-col justify-center space-y-2">
              <span className="text-sm font-semibold text-slate-500 mb-1 block">Mode d'intervention souhaité :</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-700">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="teletravail"
                    checked={interventionChoices.teletravail}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-[#0A2942] border-slate-300 rounded focus:ring-[#0A2942]"
                  />
                  <span>Télétravail</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hybride"
                    checked={interventionChoices.hybride}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-[#0A2942] border-slate-300 rounded focus:ring-[#0A2942]"
                  />
                  <span>Hybride</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="surSite"
                    checked={interventionChoices.surSite}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-[#0A2942] border-slate-300 rounded focus:ring-[#0A2942]"
                  />
                  <span>Sur site</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Ajouter votre Photo (Carrée & Professionnelle)
            </label>
            
            <div className="grid sm:grid-cols-2 gap-4 items-center">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-white rounded-xl p-4 text-center">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png"
                  className="hidden" 
                />
                
                {previewUrl ? (
                  <div>
                    <img src={previewUrl} alt="Aperçu" className="w-20 h-20 object-cover rounded-xl mx-auto border" />
                    <button type="button" onClick={() => fileInputRef.current.click()} className="mt-2 text-xs text-blue-600 font-semibold underline">Changer</button>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="bg-[#0A2942] text-white text-sm font-bold py-2 px-4 rounded-xl hover:bg-slate-800 transition"
                    >
                      CHARGER MA PHOTO
                    </button>
                    <p className="text-[11px] text-slate-500 mt-2">Format carré uniquement (.jpg, .png)</p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-300 overflow-hidden shrink-0">
                  <svg className="w-12 h-12 text-slate-400 mt-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block mb-0.5">Style de photo accepté :</span>
                  Gros plan professionnel, centré et cadré carré (Exemple).
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-sm text-slate-600">
            Les informations transmises restent strictement confidentielles.
            Les entreprises clientes n’accèdent pas directement à vos coordonnées
            avant validation de la mise en relation et contractualisation via
            ITERIUM PARTNERS.
          </div>

          <button
            type="submit"
            className="w-full bg-[#F8B400] text-[#0A2942] font-bold py-4 rounded-2xl hover:bg-yellow-400 transition"
          >
            Rejoindre le réseau ITERIUM PARTNERS
          </button>
        </form>

      </div>
    </div>
  );
}
