import { type Locale, getDictionary } from '@/lib/i18n';
import { Metadata } from 'next';
import AnimatedBackground from '@/components/AnimatedBackground';
import InteractiveTitle from '@/components/InteractiveTitle';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles = {
    fr: "Mentions Légales",
    de: "Impressum",
    en: "Legal Notice"
  };

  const descriptions = {
    fr: "Mentions légales et conditions d'utilisation du site Cœur de l'OM.",
    de: "Impressum und Nutzungsbedingungen der Website Cœur de l'OM.",
    en: "Legal notice and terms of use for the Cœur de l'OM website."
  };

  return {
    title: titles[lang as Locale] || titles.fr,
    description: descriptions[lang as Locale] || descriptions.fr,
    keywords: ["mentions légales", "conditions d'utilisation", "propriété intellectuelle", "données personnelles", "legal notice", "terms of use", "Impressum"],
    openGraph: {
      title: `${titles[lang as Locale] || titles.fr} | Cœur de l'OM`,
      description: descriptions[lang as Locale] || descriptions.fr,
      images: ['/Coeur-de-lOm-Alpha-Kopie.png'],
    },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  const titles = {
    fr: "Mentions Légales",
    de: "Impressum",
    en: "Legal Notice"
  };

  const content = {
    fr: <FrenchContent />,
    de: <GermanContent />,
    en: <EnglishContent />
  };

  return (
    <main className="relative min-h-screen pt-40 pb-20 bg-gradient-to-br from-white via-purple-50/20 to-cyan-50/20 overflow-hidden">
      <AnimatedBackground />
      <div className="container mx-auto px-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <InteractiveTitle className="text-5xl md:text-6xl font-normal text-purple-900">
            {titles[lang as Locale] || titles.fr}
          </InteractiveTitle>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100/50">
          <div className="prose prose-lg max-w-none">
            {content[lang as Locale] || content.fr}
          </div>
        </div>
      </div>
    </main>
  );
}

function FrenchContent() {
  return (
    <>

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
              <li><strong>Créateur du site :</strong> netventure consulting SARL</li>
              <li><strong>Responsable publication :</strong> Valérie Jourdan – contact@coeurdelom.fr</li>
              <li><strong>Webmaster :</strong> Yan Heydlauf – y.heydlauf@netventure.tv</li>
              <li><strong>Hébergeur :</strong> Netlify.com</li>
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
    </>
  );
}

function GermanContent() {
  return (
    <>
      <h2 className="text-3xl font-bold text-purple-800 mt-8 mb-4">ANGABEN ZUR WEBSITE</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Gemäß Artikel 6 des Gesetzes Nr. 2004-575 vom 21. Juni 2004 für das Vertrauen in die digitale Wirtschaft,
        die verschiedenen Beteiligten der Website im Rahmen ihrer Realisierung und Betreuung:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          <strong>Eigentümer:</strong> Valérie Jourdan EI – 92282112900017, EI Autor mit Kapital von €. Der Eigentümer
          der Website ist unter folgender Adresse erreichbar: contact@coeurdelom.fr
        </li>
        <li><strong>Adresse:</strong> 140 rue Pioch Boutonnet 34090 Montpellier</li>
        <li><strong>Website-Ersteller:</strong> netventure consulting SARL</li>
        <li><strong>Verantwortlich für Veröffentlichung:</strong> Valérie Jourdan – contact@coeurdelom.fr</li>
        <li><strong>Webmaster:</strong> Yan Heydlauf – y.heydlauf@netventure.tv</li>
        <li><strong>Hosting:</strong> Netlify.com</li>
      </ul>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">NUTZUNGSBEDINGUNGEN</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Die Nutzung der Website impliziert die vollständige Zustimmung zu den nachfolgend beschriebenen allgemeinen Nutzungsbedingungen. Diese Nutzungsbedingungen können jederzeit geändert oder ergänzt werden. Die Nutzer der Website werden daher gebeten, diese regelmäßig zu konsultieren.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Die Website wird regelmäßig von Valérie Jourdan aktualisiert. Ebenso können die rechtlichen Hinweise jederzeit geändert werden: Sie sind jedoch für den Nutzer bindend, der aufgefordert wird, sich so oft wie möglich darauf zu beziehen, um davon Kenntnis zu nehmen.
      </p>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">BEREITGESTELLTE DIENSTE</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Valérie Jourdan bemüht sich, auf der Website möglichst genaue Informationen bereitzustellen.
        Sie kann jedoch nicht für Auslassungen, Ungenauigkeiten und Mängel bei der Aktualisierung verantwortlich gemacht werden, ob sie von ihr selbst oder von Drittpartnern stammen, die ihr diese Informationen zur Verfügung stellen.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Alle auf der Website https://coeurdelom.fr/ angegebenen Informationen dienen nur zur Information und können sich ändern. Auch können sich alle auf der Website https://coeurdelom.fr/ angegebenen Informationen jederzeit ohne Vorankündigung ändern oder weiterentwickeln.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Wenn Sie einen Mangel, einen Fehler oder eine Fehlfunktion feststellen, teilen Sie dies bitte per E-Mail an contact@coeurdelom.fr mit und beschreiben Sie das Problem so genau wie möglich (Sie befinden sich auf einem Telefon, einem Tablet oder einem Computer; Name der Seite, die ein Problem darstellt, Art des Betriebssystems, verwendeter Browser usw.).
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Valérie Jourdan ist in keinem Fall verantwortlich für die Verwendung dieser Informationen und für direkte oder indirekte Schäden, die daraus entstehen können.
      </p>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">GEISTIGES EIGENTUM UND FÄLSCHUNGEN</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Valérie Jourdan EI ist Eigentümer der geistigen Eigentumsrechte oder besitzt die Nutzungsrechte an allen auf der Website zugänglichen Elementen, insbesondere Texten, Bildern, Grafiken, Logos, Symbolen, Tönen und Software.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Jede Reproduktion, Darstellung, Änderung, Veröffentlichung, Verteilung, Weiterübertragung, Anpassung aller oder eines Teils der Elemente der Website, unabhängig von den verwendeten Mitteln oder Verfahren, ist ohne vorherige schriftliche Genehmigung von https://coeurdelom.fr/ verboten.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Jede unbefugte Nutzung der Website oder eines ihrer Elemente wird als Fälschung betrachtet und gemäß den Bestimmungen der Artikel L.335-2 und folgende des Gesetzes über geistiges Eigentum verfolgt.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Die Nichteinhaltung dieses Verbots stellt eine Fälschung dar, die die zivil- und strafrechtliche Haftung des Fälschers begründen kann. Darüber hinaus könnten die Eigentümer der kopierten Inhalte rechtliche Schritte gegen Sie einleiten.
      </p>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">HAFTUNGSBESCHRÄNKUNGEN</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Der Nutzer der Website verpflichtet sich, mit aktueller, virenfreier Hardware und einem aktuellen Browser auf die Website zuzugreifen.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Valérie Jourdan kann nicht für direkte und indirekte Schäden an der Hardware des Nutzers beim Zugriff auf die Website https://coeurdelom.fr/ verantwortlich gemacht werden, die entweder auf die Verwendung von Hardware zurückzuführen sind, die nicht den oben genannten Spezifikationen entspricht, oder auf das Auftreten eines Fehlers oder einer Inkompatibilität.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Valérie Jourdan kann auch nicht für indirekte Schäden (wie z. B. Marktverlust oder Chancenverlust) verantwortlich gemacht werden, die aus der Nutzung der Website https://coeurdelom.fr/ resultieren.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Interaktive Bereiche (Möglichkeit, Fragen im Kontaktbereich zu stellen) stehen den Nutzern zur Verfügung. Valérie Jourdan behält sich das Recht vor, ohne vorherige Aufforderung alle in diesem Bereich hinterlegten Inhalte zu löschen, die gegen die in Frankreich geltenden Rechtsvorschriften verstoßen, insbesondere gegen die Bestimmungen zum Datenschutz.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Gegebenenfalls behält sich Valérie Jourdan auch vor, die zivil- und/oder strafrechtliche Haftung des Nutzers geltend zu machen, insbesondere bei Nachrichten mit diffamierendem, rassistischem, beleidigendem oder pornografischem Charakter, unabhängig vom verwendeten Medium (Text, Video, Foto usw.).
      </p>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">VERWALTUNG PERSONENBEZOGENER DATEN</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        In Frankreich werden personenbezogene Daten insbesondere durch das Gesetz Nr. 78-87 vom 6. Januar 1978, das Gesetz Nr. 2004-801 vom 6. August 2004, Artikel L. 226-13 des Strafgesetzbuchs und die Europäische Richtlinie vom 24. Oktober 1995 geschützt.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Bei der Nutzung der Website https://coeurdelom.fr/ können folgende Daten erhoben werden: die URL der Links, über die der Nutzer auf diese Website zugegriffen hat, der Zugangsanbieter des Nutzers, die Internet Protocol (IP)-Adresse des Nutzers.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        In jedem Fall sammelt Valérie Jourdan personenbezogene Daten des Nutzers nur für den Bedarf bestimmter Dienste, die von der Website https://coeurdelom.fr/ angeboten werden. Der Nutzer stellt diese Informationen wissentlich zur Verfügung, insbesondere wenn er sie selbst eingibt. Dem Nutzer der Website https://coeurdelom.fr/ wird dann mitgeteilt, ob die Angabe dieser Informationen obligatorisch ist oder nicht.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Gemäß den Bestimmungen der Artikel 38 und folgenden des Gesetzes 78-17 vom 6. Januar 1978 über Informatik, Dateien und Freiheiten hat jeder Nutzer das Recht auf Zugang, Berichtigung und Widerspruch bezüglich der ihn betreffenden personenbezogenen Daten, indem er seinen schriftlichen und unterzeichneten Antrag stellt, begleitet von einer Kopie des Ausweisdokuments mit Unterschrift des Inhabers, unter Angabe der Adresse, an die die Antwort gesendet werden soll.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Keine persönlichen Informationen des Nutzers der Website https://coeurdelom.fr/ werden ohne Wissen des Nutzers veröffentlicht, ausgetauscht, übertragen, abgetreten oder auf irgendeinem Medium an Dritte verkauft. Nur die Hypothese des Kaufs von Valérie Jourdan und/oder der Website ihrer Rechte würde die Übermittlung dieser Informationen an den eventuellen Käufer ermöglichen, der seinerseits zur gleichen Verpflichtung zur Aufbewahrung und Änderung der Daten gegenüber dem Nutzer der Website gehalten wäre.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Datenbanken sind durch die Bestimmungen des Gesetzes vom 1. Juli 1998 geschützt, das die Richtlinie 96/9 vom 11. März 1996 über den rechtlichen Schutz von Datenbanken umsetzt.
      </p>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">HYPERLINKS UND COOKIES</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Die Website https://coeurdelom.fr/ kann eine Reihe von Hyperlinks zu anderen Websites enthalten, die mit Genehmigung von Valérie Jourdan eingerichtet wurden.
        Valérie Jourdan hat jedoch nicht die Möglichkeit, den Inhalt der so besuchten Websites zu überprüfen, und übernimmt daher keine Verantwortung dafür.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Das Navigieren auf der Website https://coeurdelom.fr/ kann zur Installation von Cookie(s) auf dem Computer des Nutzers führen.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Ein Cookie ist eine kleine Datei, die die Identifizierung des Nutzers nicht ermöglicht, aber Informationen über die Navigation eines Computers auf einer Website aufzeichnet. Die so erhaltenen Daten dienen dazu, die spätere Navigation auf der Website zu erleichtern und haben auch den Zweck, verschiedene Messungen der Besucherzahlen zu ermöglichen.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Die Ablehnung der Installation eines Cookies kann dazu führen, dass bestimmte Dienste nicht zugänglich sind. Der Nutzer kann seinen Computer jedoch wie folgt konfigurieren, um die Installation von Cookies abzulehnen:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          <strong>In Internet Explorer:</strong> Registerkarte Extras (Zahnrad-Symbol oben rechts) / Internetoptionen. Klicken Sie auf Datenschutz und wählen Sie Alle Cookies blockieren. Bestätigen Sie mit OK.
        </li>
        <li>
          <strong>In Firefox:</strong> Klicken Sie oben im Browserfenster auf die Schaltfläche Firefox und gehen Sie dann zur Registerkarte Optionen. Klicken Sie auf die Registerkarte Datenschutz. Setzen Sie die Aufbewahrungsregeln auf: benutzerdefinierte Einstellungen für die Historie verwenden. Deaktivieren Sie schließlich die Cookies.
        </li>
        <li>
          <strong>In Safari:</strong> Klicken Sie oben rechts im Browser auf das Menüsymbol (dargestellt durch ein Zahnrad). Wählen Sie Einstellungen. Klicken Sie auf Erweiterte Einstellungen anzeigen. Klicken Sie im Abschnitt "Datenschutz" auf Inhaltseinstellungen. Im Abschnitt "Cookies" können Sie Cookies blockieren.
        </li>
        <li>
          <strong>In Chrome:</strong> Klicken Sie oben rechts im Browser auf das Menüsymbol (dargestellt durch drei horizontale Linien). Wählen Sie Einstellungen. Klicken Sie auf Erweiterte Einstellungen anzeigen. Klicken Sie im Abschnitt "Datenschutz" auf Einstellungen. Auf der Registerkarte "Datenschutz" können Sie Cookies blockieren.
        </li>
      </ul>
      <p className="text-gray-700 leading-relaxed mb-4">
        Die im Rahmen dieser Website eingerichteten Hyperlinks zu anderen im Internet vorhandenen Ressourcen begründen keine Haftung von Valérie Jourdan.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Jeder heruntergeladene Inhalt erfolgt auf eigene Gefahr und unter alleiniger Verantwortung des Nutzers. Folglich kann Valérie Jourdan nicht für Schäden am Computer des Nutzers oder für Datenverluste infolge des Downloads verantwortlich gemacht werden.
      </p>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">ANWENDBARES RECHT UND GERICHTSSTAND</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Diese Bedingungen der Website https://coeurdelom.fr/ unterliegen französischem Recht, und alle Streitigkeiten oder Rechtsstreitigkeiten, die sich aus der Auslegung oder Ausführung dieser Bedingungen ergeben können, fallen in die ausschließliche Zuständigkeit der Gerichte, denen der Firmensitz von Valérie Jourdan untersteht. Die Referenzsprache für die Beilegung etwaiger Streitigkeiten ist Französisch.
      </p>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">HAUPTSÄCHLICH BETROFFENE GESETZE</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          Gesetz Nr. 78-17 vom 6. Januar 1978, insbesondere geändert durch das Gesetz Nr. 2004-801 vom 6. August 2004 über Informatik, Dateien und Freiheiten.
        </li>
        <li>Gesetz Nr. 2004-575 vom 21. Juni 2004 für das Vertrauen in die digitale Wirtschaft.</li>
      </ul>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">GLOSSAR</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
        <li><strong>Website-Eigentümer:</strong> Rechtlich Verantwortlicher für die in der Website enthaltenen Informationen</li>
        <li><strong>Webmaster:</strong> Person, die für die technische Wartung und technische Updates der Website verantwortlich ist</li>
        <li>
          <strong>Verantwortlich für Veröffentlichung:</strong> Person, die für die Aktualisierung der Inhalte (Texte, visuelle Elemente, Multimedia usw.) auf der Website verantwortlich ist
        </li>
        <li><strong>Hosting:</strong> Speicherplatz der Website</li>
        <li><strong>Nutzer:</strong> Internetnutzer, der sich mit der oben genannten Website verbindet und diese nutzt.</li>
        <li>
          <strong>Persönliche Informationen:</strong> „Informationen, die es ermöglichen, in welcher Form auch immer, direkt oder indirekt, die Identifizierung der natürlichen Personen, auf die sie sich beziehen"
          (Artikel 4 des Gesetzes Nr. 78-17 vom 6. Januar 1978).
        </li>
      </ul>
    </>
  );
}

function EnglishContent() {
  return (
    <>
      <h2 className="text-3xl font-bold text-purple-800 mt-8 mb-4">WEBSITE PRESENTATION</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Pursuant to Article 6 of Law No. 2004-575 of June 21, 2004 for confidence in the digital economy,
        the various stakeholders of the website in the context of its creation and monitoring:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          <strong>Owner:</strong> Valérie Jourdan EI – 92282112900017, EI author with capital of €. The owner of
          the website can be contacted at this address: contact@coeurdelom.fr
        </li>
        <li><strong>Address:</strong> 140 rue Pioch Boutonnet 34090 Montpellier</li>
        <li><strong>Website Creator:</strong> netventure consulting SARL</li>
        <li><strong>Publication Manager:</strong> Valérie Jourdan – contact@coeurdelom.fr</li>
        <li><strong>Webmaster:</strong> Yan Heydlauf – y.heydlauf@netventure.tv</li>
        <li><strong>Hosting:</strong> Netlify.com</li>
      </ul>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">TERMS OF USE</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Use of the website implies full acceptance of the general terms of use described below. These terms of use are subject to change or addition at any time, users of the website are therefore invited to consult them regularly.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        The website is regularly updated by Valérie Jourdan. Similarly, the legal notices may be modified at any time: they nevertheless apply to the user who is invited to refer to them as often as possible in order to become aware of them.
      </p>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">SERVICES PROVIDED</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Valérie Jourdan strives to provide information on the website as accurate as possible.
        However, she cannot be held responsible for omissions, inaccuracies and deficiencies in the update, whether they are her own or from third-party partners who provide her with this information.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        All information indicated on the website https://coeurdelom.fr/ is given for information purposes only, and is subject to change. Also, all information indicated on the website https://coeurdelom.fr/ is given for information purposes only, and is subject to change or evolution without notice.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        If you notice a gap, error or what appears to be a malfunction, please report it by email to contact@coeurdelom.fr, describing the problem as precisely as possible (you are on a phone, tablet or computer; name of the page that poses a problem, type of operating system, browser used, etc.).
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Valérie Jourdan is in no way responsible for the use made of this information, and for any direct or indirect damage that may result.
      </p>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">INTELLECTUAL PROPERTY AND COUNTERFEITING</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Valérie Jourdan EI owns the intellectual property rights or holds the usage rights to all elements accessible on the website, including texts, images, graphics, logos, icons, sounds, and software.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Any reproduction, representation, modification, publication, distribution, retransmission, adaptation of all or part of the elements of the website, whatever the means or process used, is prohibited, except with prior written authorization from https://coeurdelom.fr/.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Any unauthorized exploitation of the website or any of the elements it contains, by any process whatsoever, will be considered as constituting an infringement and prosecuted in accordance with the provisions of articles L.335-2 and following of the Intellectual Property Code.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Failure to comply with this prohibition constitutes an infringement that may engage the civil and criminal liability of the counterfeiter. In addition, the owners of the copied content could take legal action against you.
      </p>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">LIMITATIONS OF LIABILITY</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        The user of the website undertakes to access the website using recent equipment, not containing viruses and with an up-to-date latest generation browser.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Valérie Jourdan cannot be held responsible for direct and indirect damage caused to the user's equipment when accessing the website https://coeurdelom.fr/, and resulting either from the use of equipment that does not meet the specifications indicated above, or from the appearance of a bug or incompatibility.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Valérie Jourdan also cannot be held responsible for indirect damages (such as a loss of market or loss of opportunity) resulting from the use of the website https://coeurdelom.fr/.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Interactive spaces (ability to ask questions in the contact area) are available to users. Valérie Jourdan reserves the right to delete, without prior notice, any content deposited in this space that would contravene the legislation applicable in France, in particular the provisions relating to data protection.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        If necessary, Valérie Jourdan also reserves the possibility of holding the user civilly and/or criminally liable, particularly in the case of messages of a defamatory, racist, insulting or pornographic nature, whatever the medium used (text, video, photograph, etc.).
      </p>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">PERSONAL DATA MANAGEMENT</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        In France, personal data is protected by Law No. 78-87 of January 6, 1978, Law No. 2004-801 of August 6, 2004, Article L. 226-13 of the Penal Code and the European Directive of October 24, 1995.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        When using the website https://coeurdelom.fr/, the following may be collected: the URL of the links through which the user accessed this website, the user's access provider, the user's Internet Protocol (IP) address.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        In any case, Valérie Jourdan only collects personal information relating to the user for the need of certain services offered by the website https://coeurdelom.fr/. The user provides this information knowingly, particularly when they enter it themselves. The user of the website https://coeurdelom.fr/ is then informed whether the provision of this information is mandatory or not.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        In accordance with the provisions of Articles 38 and following of Law 78-17 of January 6, 1978 relating to data processing, files and freedoms, every user has a right of access, rectification and opposition to personal data concerning them, by making their written and signed request, accompanied by a copy of the identity document with signature of the holder, specifying the address to which the response should be sent.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        No personal information of the user of the website https://coeurdelom.fr/ is published without the user's knowledge, exchanged, transferred, assigned or sold on any medium to third parties. Only the hypothesis of the purchase of Valérie Jourdan and/or the website of its rights would allow the transmission of said information to the possible acquirer who would in turn be bound by the same obligation of conservation and modification of data vis-à-vis the user of the website.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Databases are protected by the provisions of the law of July 1, 1998 transposing Directive 96/9 of March 11, 1996 on the legal protection of databases.
      </p>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">HYPERLINKS AND COOKIES</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        The website https://coeurdelom.fr/ may contain a number of hyperlinks to other websites, set up with the authorization of Valérie Jourdan.
        However, Valérie Jourdan does not have the ability to verify the content of the websites thus visited, and will therefore assume no responsibility for this fact.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Navigation on the website https://coeurdelom.fr/ may cause the installation of cookie(s) on the user's computer.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        A cookie is a small file that does not allow the identification of the user, but which records information relating to the navigation of a computer on a website. The data thus obtained aim to facilitate subsequent navigation on the website, and also aim to allow various measures of attendance.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Refusing to install a cookie may make it impossible to access certain services. However, the user can configure their computer as follows to refuse the installation of cookies:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          <strong>In Internet Explorer:</strong> Tools tab (gear icon at the top right) / Internet options. Click on Privacy and choose Block all cookies. Confirm with OK.
        </li>
        <li>
          <strong>In Firefox:</strong> At the top of the browser window, click on the Firefox button, then go to the Options tab. Click on the Privacy tab. Set the Retention Rules to: use custom settings for history. Finally uncheck it to disable cookies.
        </li>
        <li>
          <strong>In Safari:</strong> Click at the top right of the browser on the menu icon (symbolized by a gear). Select Settings. Click on Show advanced settings. In the "Privacy" section, click on Content settings. In the "Cookies" section, you can block cookies.
        </li>
        <li>
          <strong>In Chrome:</strong> Click at the top right of the browser on the menu icon (symbolized by three horizontal lines). Select Settings. Click on Show advanced settings. In the "Privacy" section, click on preferences. In the "Privacy" tab, you can block cookies.
        </li>
      </ul>
      <p className="text-gray-700 leading-relaxed mb-4">
        The hyperlinks set up as part of this website to other resources present on the Internet cannot engage the responsibility of Valérie Jourdan.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Any downloaded content is at the user's own risk and under their sole responsibility. Consequently, Valérie Jourdan cannot be held responsible for any damage suffered by the user's computer or any loss of data resulting from the download.
      </p>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">APPLICABLE LAW AND JURISDICTION</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        These conditions of the website https://coeurdelom.fr/ are governed by French laws and any dispute or litigation that may arise from the interpretation or execution of these will be under the exclusive jurisdiction of the courts on which the registered office of Valérie Jourdan depends. The reference language for the settlement of any disputes is French.
      </p>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">MAIN LAWS CONCERNED</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
        <li>
          Law No. 78-17 of January 6, 1978, notably modified by Law No. 2004-801 of August 6, 2004 relating to data processing, files and freedoms.
        </li>
        <li>Law No. 2004-575 of June 21, 2004 for confidence in the digital economy.</li>
      </ul>

      <h2 className="text-3xl font-bold text-purple-800 mt-12 mb-4">GLOSSARY</h2>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
        <li><strong>Website Owner:</strong> Legal responsible for the information contained in the website</li>
        <li><strong>Webmaster:</strong> Person in charge of technical maintenance and technical updates of the website</li>
        <li>
          <strong>Publication Manager:</strong> Person in charge of updating content (texts, visuals, multimedia, etc.) on the website
        </li>
        <li><strong>Hosting:</strong> Storage space of the website</li>
        <li><strong>User:</strong> Internet user connecting to and using the aforementioned website.</li>
        <li>
          <strong>Personal Information:</strong> "information that allows, in any form whatsoever, directly or not, the identification of the natural persons to whom they apply"
          (Article 4 of Law No. 78-17 of January 6, 1978).
        </li>
      </ul>
    </>
  );
}
