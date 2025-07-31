import React from 'react';
import InformationCircleIcon from '../components/icons/InformationCircleIcon';

const InfoCard: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="bg-[#2C2A44] p-6 rounded-lg border border-white/10 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <div className="space-y-3 text-gray-300 leading-relaxed">
            {children}
        </div>
    </div>
);

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <code className="block bg-[#1e1c3a] text-yellow-300 p-3 rounded-md text-sm font-mono my-2 w-full overflow-x-auto">
        {children}
    </code>
);

const InfoView: React.FC = () => {
  return (
    <div className="animate-scale-in-pop space-y-8">
      <header className="flex items-center mb-6">
        <InformationCircleIcon className="w-8 h-8 text-yellow-400 mr-4" />
        <h2 className="text-3xl font-bold text-white">Informations & Déploiement</h2>
      </header>

      <div className="space-y-6">
        <InfoCard title="Comment vos données sont-elles sauvegardées ?">
            <p>
                Cette application fonctionne entièrement dans votre navigateur et n'a pas de serveur central. Vos données (profils, listes de craft, ventes) sont stockées localement grâce à une technologie appelée <strong className="text-yellow-400">LocalStorage</strong>.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 mt-2">
                <li><strong className="text-white">Avantages :</strong> C'est ultra-rapide, 100% privé, et fonctionne même sans connexion internet une fois la page chargée.</li>
                <li><strong className="text-white">Inconvénients :</strong> Les données sont liées à UN SEUL navigateur sur UN SEUL ordinateur. Elles ne sont pas synchronisées entre vos appareils.</li>
            </ul>
             <p className="p-3 mt-4 bg-red-900/50 text-red-200 border-l-4 border-red-500 rounded-r-lg">
                <strong>Attention :</strong> Si vous videz le cache ou les données de votre navigateur, <strong className="font-bold">toutes les données de l'application seront définitivement perdues.</strong>
            </p>
        </InfoCard>

        <InfoCard title="Comment déployer et utiliser votre application ?">
             <p>Votre application est maintenant un projet <strong className='text-white'>Vite</strong> standard. Cela la rend plus robuste et facile à déployer sur n'importe quel service d'hébergement moderne.</p>
             
             <div className="bg-[#3B385E] p-4 rounded-lg mt-4">
                 <h4 className="font-bold text-lg text-white">Déployer sur Netlify (Recommandé)</h4>
                 <p className="text-sm text-gray-400 mb-3">Pour accéder à votre application depuis n'importe où via une URL publique.</p>
                 <ol className="list-decimal list-inside space-y-4">
                    <li>Poussez le code de votre application (avec le nouveau `package.json`) sur un dépôt <strong className="text-white">GitHub</strong>.</li>
                    <li>Sur <strong className="text-white">Netlify</strong>, importez le projet depuis votre dépôt GitHub.</li>
                    <li>
                        Configurez les paramètres de déploiement comme suit :
                        <ul className='list-disc list-inside pl-4 mt-2 space-y-1'>
                            <li><strong>Build command:</strong> <CodeBlock>npm run build</CodeBlock></li>
                            <li><strong>Publish directory:</strong> <CodeBlock>dist</CodeBlock></li>
                        </ul>
                    </li>
                    <li>
                        Ajoutez votre clé API en tant que variable d'environnement :
                        <ul className='list-disc list-inside pl-4 mt-2 space-y-1'>
                           <li>Allez dans `Site settings` > `Build & deploy` > `Environment`.</li>
                           <li>Ajoutez une variable avec la clé <strong className="text-white">`VITE_API_KEY`</strong> et collez votre clé API en valeur. Le préfixe `VITE_` est <strong className="text-red-400">obligatoire</strong> pour que l'application puisse y accéder.</li>
                        </ul>
                    </li>
                    <li>Cliquez sur "Deploy site". Netlify va maintenant construire votre projet et le mettre en ligne !</li>
                 </ol>
             </div>
        </InfoCard>
      </div>
    </div>
  );
};

export default InfoView;