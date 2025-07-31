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
    <code className="block bg-[#1e1c3a] text-yellow-300 p-3 rounded-md text-sm font-mono my-2">
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
            <p>
                C'est comme avoir un petit coffre-fort directement dans votre navigateur (Chrome, Firefox, etc.).
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong className="text-white">Avantages :</strong> C'est ultra-rapide, 100% privé, et fonctionne même sans connexion internet une fois la page chargée.</li>
                <li><strong className="text-white">Inconvénients :</strong> Les données sont liées à UN SEUL navigateur sur UN SEUL ordinateur. Elles ne sont pas synchronisées entre vos appareils.</li>
            </ul>
             <p className="p-3 bg-red-900/50 text-red-200 border-l-4 border-red-500 rounded-r-lg">
                <strong>Attention :</strong> Si vous videz le cache ou les données de votre navigateur, <strong className="font-bold">toutes les données de l'application seront définitivement perdues.</strong>
            </p>
        </InfoCard>

        <InfoCard title="Comment déployer et utiliser votre application ?">
             <p>Pour utiliser cette application de manière stable, vous pouvez l'héberger vous-même. Voici deux méthodes simples.</p>
             
             <div className="bg-[#3B385E] p-4 rounded-lg mt-4">
                 <h4 className="font-bold text-lg text-white">Option 1 : Utilisation sur votre ordinateur (Local)</h4>
                 <p className="text-sm text-gray-400 mb-3">Pour faire tourner l'application uniquement sur votre PC.</p>
                 <ol className="list-decimal list-inside space-y-2">
                    <li>Téléchargez le code source de l'application dans un dossier.</li>
                    <li>Assurez-vous d'avoir <strong className="text-white">Node.js</strong> installé sur votre ordinateur.</li>
                    <li>Ouvrez un terminal (cmd, PowerShell, etc.) dans le dossier du projet et exécutez la commande pour installer les dépendances :<CodeBlock>npm install</CodeBlock></li>
                    <li>Une fois l'installation terminée, lancez un serveur de développement simple avec cette commande :<CodeBlock>npx serve</CodeBlock></li>
                    <li>Le terminal vous donnera une adresse locale (souvent `http://localhost:3000`). Mettez cette adresse dans vos favoris !</li>
                 </ol>
             </div>
             
             <div className="bg-[#3B385E] p-4 rounded-lg mt-4">
                 <h4 className="font-bold text-lg text-white">Option 2 : Mettre en ligne (Recommandé)</h4>
                 <p className="text-sm text-gray-400 mb-3">Pour accéder à votre application depuis n'importe où via une URL publique.</p>
                 <ol className="list-decimal list-inside space-y-2">
                    <li>Mettez le code de votre application sur un dépôt <strong className="text-white">GitHub</strong>.</li>
                    <li>Créez un compte gratuit sur un service comme <strong className="text-white">Vercel</strong> ou <strong className="text-white">Netlify</strong> et liez-le à votre compte GitHub.</li>
                    <li>Importez le dépôt de votre application sur Vercel ou Netlify.</li>
                    <li>Le service détectera automatiquement que c'est une application React/Vite et la déploiera pour vous. En quelques minutes, vous aurez une URL publique (ex: `dofus-helper.vercel.app`) que vous pourrez utiliser partout.</li>
                 </ol>
             </div>
        </InfoCard>
      </div>
    </div>
  );
};

export default InfoView;
