import { type Locale, getDictionary } from '@/lib/i18n';
import { Metadata } from 'next';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveTitle from '@/components/InteractiveTitle';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: "Mentions Légales",
    description: "Mentions légales et conditions d'utilisation du site Cœur de l'OM.",
    keywords: ["mentions légales", "conditions d'utilisation", "propriété intellectuelle", "données personnelles"],
    openGraph: {
      title: "Mentions Légales | Cœur de l'OM",
      description: "Mentions légales et conditions d'utilisation du site Cœur de l'OM.",
      images: ['/Coeur-de-lOm-Alpha-Kopie.png'],
    },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return (
    <main className="relative min-h-screen pt-40 pb-20 bg-gradient-to-br from-white via-purple-50/20 to-cyan-50/20 overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto px-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <InteractiveTitle className="text-5xl md:text-6xl font-normal text-purple-900">
            Mentions Légales
          </InteractiveTitle>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100/50">
          <div className="prose prose-lg max-w-none">

            <h2 className="text-3xl font-bold text-purple-800 mt-8 mb-4">PRÉSENTATION DU SITE</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique,
              les différents intervenants du site dans le cadre de sa réalisation et de son suivi :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>
                <strong>Propriétaire :</strong> Valérie Jourdan EI – 92282112900017, EI auteur au capital de €. Le propriétaire du
                site internet est joignable à cette adresse : contact@coeurdelom.fr
              </li>
              <li><strong>Adresse :</strong> 140 rue Pioch Boutonnet 34090 Montpellier</li>
              <li><strong>Créateur du site :</strong> LYKOS AGENCY LTD</li>
              <li><strong>Responsable publication :</strong> Valérie Jourdan – contact@coeurdelom.fr</li>
              <li><strong>Webmaster :</strong> Amine Khalili – contact@lykosagency.com</li>
              <li>
                <strong>Hébergeur :</strong> FASTCOMMET 1007 North Orange Street 4th Fl. #255, Wilmington, DE
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">CONDITIONS D'UTILISATION</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              L'utilisation du site implique l'acceptation pleine et entière des conditions générales d'utilisation ci-après
              décrites. Ces conditions d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment, les utilisateurs du site sont donc invités à les consulter de manière régulière.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Le site est mis à jour régulièrement par Valérie Jourdan. De la même façon, les mentions légales peuvent
              être modifiées à tout moment : elles s'imposent néanmoins à l'utilisateur qui est invité à s'y référer le plus
              souvent possible afin d'en prendre connaissance.
            </p>

            <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">SERVICES FOURNIS</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Valérie Jourdan, s'efforce de fournir sur le site des informations aussi précises que possible.
              Toutefois, il ne pourra être tenue responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Tous les informations indiquées sur le site https://coeurdelom.fr/ sont données à titre indicatif, et sont
              susceptibles d'évoluer. Aussi, toutes les informations indiquées sur le site Site https://coeurdelom.fr/ sont
              données à titre indicatif, et sont susceptibles de changer ou d'évoluer sans préavis.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le
              signaler par email, à l'adresse contact@coeurdelom.fr, en décrivant le problème de la manière la plus
              précise possible (vous vous trouver sur un téléphone, une tablette ou bien un ordinateur ; nom de la page qui pose problème, type de système d'exploitation, navigateur utilisé,…).
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Valérie Jourdan n'est en aucun cas responsable de l'utilisation faite de ces informations, et de tout
              préjudice direct ou indirect pouvant en découler.
            </p>

            <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">PROPRIÉTÉ INTELLECTUELLE ET CONTREFAÇONS</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Valérie Jourdan EI est le propriétaire des droits de propriété intellectuelle ou détient les droits d'usage sur tous les éléments accessibles sur le site, notamment les textes, images, graphismes, logo, icônes, sons, logiciels.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Toute reproduction, représentation, modification, publication, distribution, retransmission, adaptation de
              tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf
              autorisation écrite préalable de : https://coeurdelom.fr/.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient, par quelque
              procédé que ce soit, sera considérée comme constitutive d'une contrefaçon et poursuivie conformément
              aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Le non-respect de cette interdiction constitue une contrefaçon pouvant engager la responsabilité civile et pénale du contrefacteur. En outre, les propriétaires des Contenus copiés pourraient intenter une action en justice à votre encontre.
            </p>

            <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">LIMITATIONS DE RESPONSABILITÉS</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              L'utilisateur du site s'engage à accéder au site en utilisant un matériel récent, ne contenant pas de virus et avec un navigateur de dernière génération mis-à-jour.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Valérie Jourdan ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site https://coeurdelom.fr/, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications indiquées ci-dessus, soit de l'apparition d'un bug ou d'une incompatibilité.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Valérie Jourdan ne pourra également être tenue responsable des dommages indirects (tels par exemple
              qu'une perte de marché ou perte d'une chance) consécutifs à l'utilisation du site https://coeurdelom.fr/.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Des espaces interactifs (possibilité de poser des questions dans l'espace contact) sont à la disposition des utilisateurs. Valérie Jourdan se réserve le droit de supprimer, sans mise en demeure préalable, tout
              contenu déposé dans cet espace qui contreviendrait à la législation applicable en France, en particulier
              aux dispositions relatives à la protection des données.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Le cas échéant, Valérie Jourdan se réserve aussi la possibilité de mettre en cause la responsabilité civile
              et/ou pénale de l'utilisateur, notamment en cas de message à caractère diffamant, raciste, injurieux ou
              pornographique, quel que soit le support utilisé (texte, vidéo, photographie…).
            </p>

            <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">GESTION DES DONNÉES PERSONNELLES</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              En France, les données personnelles sont notamment protégées par la loi n° 78-87 du 6 janvier 1978, la loi n° 2004-801 du 6 août 2004, l'article L. 226-13 du Code pénal et la Directive Européenne du 24 octobre 1995.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              A l'occasion de l'utilisation du site https://coeurdelom.fr/, peuvent être recueillies : l'URL des liens par
              l'intermédiaire desquels l'utilisateur a accédé à ce site, le fournisseur d'accès de l'utilisateur, l'adresse de
              protocole Internet (IP) de l'utilisateur.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              En tout état de cause Valérie Jourdan ne collecte des informations personnelles relatives à l'utilisateur que pour le besoin de certains services proposés par le site https://coeurdelom.fr/. L'utilisateur fournit ces informations en toute connaissance de cause, notamment lorsqu'il procède par lui-même à leur saisie. Il est alors précisé à l'utilisateur du site https://coeurdelom.fr/ l'obligation ou non de fournir ces informations.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Conformément aux dispositions des articles 38 et suivants de la loi 78-17 du 6 janvier 1978 relative à
              l'informatique, aux fichiers et aux libertés, tout utilisateur dispose d'un droit d'accès, de rectification et
              d'opposition aux données personnelles le concernant, en effectuant sa demande écrite et signée,
              accompagnée d'une copie du titre d'identité avec signature du titulaire de la pièce, en précisant l'adresse à laquelle la réponse doit être envoyée.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Aucune information personnelle de l'utilisateur du site https://coeurdelom.fr/ n'est publiée à l'insu de
              l'utilisateur, échangée, transférée, cédée ou vendue sur un support quelconque à des tiers. Seule
              l'hypothèse du rachat de Valérie Jourdan et/ou du site internet de ses droits permettrait la transmission
              des dites informations à l'éventuel acquéreur qui serait à son tour tenu de la même obligation de
              conservation et de modification des données vis à vis de l'utilisateur du site.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Les bases de données sont protégées par les dispositions de la loi du 1er juillet 1998 transposant la directive 96/9 du 11 mars 1996 relative à la protection juridique des bases de données.
            </p>

            <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">LIENS HYPERTEXTES ET COOKIES</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Le site https://coeurdelom.fr/ peut contenir un certain nombre de liens hypertextes vers d'autres sites, mis en place avec l'autorisation de Valérie Jourdan.
              Cependant, Valérie Jourdan n'a pas la possibilité de vérifier le contenu des sites ainsi visités, et n'assumera en conséquence aucune responsabilité de ce fait.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              La navigation sur le site https://coeurdelom.fr/ est susceptible de provoquer l'installation de cookie(s) sur
              l'ordinateur de l'utilisateur.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Un cookie est un fichier de petite taille, qui ne permet pas l'identification de l'utilisateur, mais qui enregistre des informations relatives à la navigation d'un ordinateur sur un site. Les données ainsi obtenues visent à faciliter la navigation ultérieure sur le site, et ont également vocation à permettre diverses mesures de fréquentation.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Le refus d'installation d'un cookie peut entraîner l'impossibilité d'accéder à certains services. L'utilisateur
              peut toutefois configurer son ordinateur de la manière suivante, pour refuser l'installation des cookies :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>
                <strong>Sous Internet Explorer :</strong> onglet outil (pictogramme en forme de rouage en haut a droite) / options
                internet. Cliquez sur Confidentialité et choisissez Bloquer tous les cookies. Validez sur Ok.
              </li>
              <li>
                <strong>Sous Firefox :</strong> en haut de la fenêtre du navigateur, cliquez sur le bouton Firefox, puis aller dans
                l'onglet Options. Cliquer sur l'onglet Vie privée. Paramétrez les Règles de conservation sur : utiliser les paramètres personnalisés pour
                l'historique. Enfin décochez-la pour désactiver les cookies.
              </li>
              <li>
                <strong>Sous Safari :</strong> Cliquez en haut à droite du navigateur sur le pictogramme de menu (symbolisé par
                un rouage). Sélectionnez Paramètres. Cliquez sur Afficher les paramètres avancés. Dans la section
                "Confidentialité", cliquez sur Paramètres de contenu. Dans la section "Cookies", vous pouvez
                bloquer les cookies.
              </li>
              <li>
                <strong>Sous Chrome :</strong> Cliquez en haut à droite du navigateur sur le pictogramme de menu (symbolisé par
                trois lignes horizontales). Sélectionnez Paramètres. Cliquez sur Afficher les paramètres avancés.
                Dans la section "Confidentialité", cliquez sur préférences. Dans l'onglet "Confidentialité", vous
                pouvez bloquer les cookies.
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              Les liens hypertextes mis en place dans le cadre du présent site internet en direction d'autres ressources
              présentes sur le réseau Internet ne sauraient engager la responsabilité de Valérie Jourdan.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Tout contenu téléchargé se fait aux risques et périls de l'utilisateur et sous sa seule responsabilité. En
              conséquence, Valérie Jourdan ne saurait être tenu responsable d'un quelconque dommage subi par
              l'ordinateur de l'utilisateur ou d'une quelconque perte de données consécutives au téléchargement.
            </p>

            <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">DROIT APPLICABLE ET ATTRIBUTION DE JURIDICTION</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Les présentes conditions du site https://coeurdelom.fr/ sont régies par les lois françaises et toute
              contestation ou litiges qui pourraient naître de l'interprétation ou de l'exécution de celles-ci seront de la
              compétence exclusive des tribunaux dont dépend le siège social de la société Valérie Jourdan. La langue de référence, pour le règlement de contentieux éventuels, est le français.
            </p>

            <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">LES PRINCIPALES LOIS CONCERNÉES</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>
                Loi n° 78-17 du 6 janvier 1978, notamment modifiée par la loi n° 2004-801 du 6 août 2004 relative à
                l'informatique, aux fichiers et aux libertés.
              </li>
              <li>Loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.</li>
            </ul>

            <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">LEXIQUE</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li><strong>Propriétaire du site :</strong> Responsable légal des informations contenues dans le site internet</li>
              <li><strong>Webmaster :</strong> Personne en charge du maintien technique et des mises à jour techniques du site internet</li>
              <li>
                <strong>Responsable publication :</strong> Personne en charge de la mise à jour des contenus (textes, visuels,
                multimédia, etc.) sur le site internet
              </li>
              <li><strong>Hébergeur :</strong> Espace de stockage du site internet</li>
              <li><strong>Utilisateur :</strong> Internaute se connectant, utilisant le site susnommé.</li>
              <li>
                <strong>Informations personnelles :</strong> « les informations qui permettent, sous quelque forme que ce soit,
                directement ou non, l'identification des personnes physiques auxquelles elles s'appliquent »
                (article 4 de la loi n° 78-17 du 6 janvier 1978).
              </li>
            </ul>

          </div>
        </div>
      </div>
    </main>
  );
}
