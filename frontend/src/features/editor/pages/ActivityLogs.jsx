import { useState, useEffect } from 'react';
import Footer from '../../../components/layout/Footer';
import AppHeader from '../../../components/layout/AppHeader';
import BackButton from '../../../components/ui/BackButton';
import LoadingState from '../../../components/ui/LoadingState';
import EmptyState from '../../../components/ui/EmptyState';
import { IMAGES } from '../../../constants/images';



// Données factices pour simuler le backend
const MOCK_RESOURCES = {
  book: {
    1: {
      id: 1,
      type: 'book',
      title: "Kids Picnic",
      cover: IMAGES.bookCover,
      auteur: "LutherQueen",
      pages: 80,
      collections: 2,
      lectures: "2.4K",
      dateCreation: "15 janvier 2024",
      logs: [
        {
          id: 1,
          action: "Modification de contenu",
          description: "Pages 7, 10, 20 modifiées",
          date: "7 octobre 2024",
          auteur: "LutherQueen",
          type: "modification"
        },
        {
          id: 2,
          action: "Ajout à collection",
          description: "Ajouté à la collection 'Best-sellers'",
          date: "3 octobre 2024",
          auteur: "Éditeur Admin",
          type: "collection"
        },
        {
          id: 3,
          action: "Suppression de collection",
          description: "Retiré de la collection 'Petits Héros'",
          date: "28 septembre 2024",
          auteur: "Éditeur Admin",
          type: "collection"
        },
        {
          id: 4,
          action: "Modification de couverture",
          description: "Nouvelle image de couverture téléchargée",
          date: "20 septembre 2024",
          auteur: "LutherQueen",
          type: "modification"
        },
        {
          id: 5,
          action: "Création",
          description: "Livre créé et publié",
          date: "15 janvier 2024",
          auteur: "LutherQueen",
          type: "creation"
        }
      ]
    }
  },
  collection: {
    1: {
      id: 1,
      type: 'collection',
      title: "Best-sellers",
      image: IMAGES.collection1,
      description: "Les histoires les plus aimées des enfants cette année.",
      livres: 3,
      lectures: "12.4K",
      dateCreation: "5 décembre 2023",
      logs: [
        {
          id: 1,
          action: "Ajout de livre",
          description: "'Kids Picnic' ajouté à la collection",
          date: "3 octobre 2024",
          auteur: "Éditeur Admin",
          type: "livre"
        },
        {
          id: 2,
          action: "Suppression de livre",
          description: "'La Forêt Magique' retiré de la collection",
          date: "1 octobre 2024",
          auteur: "Éditeur Admin",
          type: "livre"
        },
        {
          id: 3,
          action: "Modification de description",
          description: "Description mise à jour",
          date: "15 septembre 2024",
          auteur: "Éditeur Admin",
          type: "modification"
        },
        {
          id: 4,
          action: "Création",
          description: "Collection créée",
          date: "5 décembre 2023",
          auteur: "Éditeur Admin",
          type: "creation"
        }
      ]
    }
  },
  user: {
    1: {
      id: 1,
      type: 'user',
      name: "Marie Dubois",
      avatar: IMAGES.userAvatar,
      email: "marie.dubois@example.com",
      role: "Éditeur",
      dateInscription: "10 novembre 2023",
      logs: [
        {
          id: 1,
          action: "Connexion",
          description: "Connexion réussie depuis Paris, France",
          date: "31 octobre 2024",
          type: "connexion"
        },
        {
          id: 2,
          action: "Modification de profil",
          description: "Email mis à jour",
          date: "25 octobre 2024",
          type: "modification"
        },
        {
          id: 3,
          action: "Création de collection",
          description: "Collection 'Best-sellers' créée",
          date: "5 décembre 2023",
          type: "creation"
        },
        {
          id: 4,
          action: "Inscription",
          description: "Compte créé en tant qu'Éditeur",
          date: "10 novembre 2023",
          type: "creation"
        }
      ]
    }
  }
};

export default function PageLogsRessource({ onNavigate, resourceType = 'book', resourceId = 1 }) {
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Remplacer par un vrai appel API
    // fetch(`/api/${resourceType}/${resourceId}/logs`)
    //   .then(res => res.json())
    //   .then(data => setResource(data))

    setTimeout(() => {
      const resourceData = MOCK_RESOURCES[resourceType]?.[resourceId] || MOCK_RESOURCES.book[1];
      setResource(resourceData);
      setIsLoading(false);
    }, 300);
  }, [resourceType, resourceId]);

  const getResourceTitle = () => {
    if (resourceType === 'book') return 'Livre';
    if (resourceType === 'collection') return 'Collection';
    if (resourceType === 'user') return 'Utilisateur';
    return 'Ressource';
  };

  const getLogTypeColor = (type) => {
    switch (type) {
      case 'creation': return 'text-green-600';
      case 'modification': return 'text-blue-600';
      case 'collection': return 'text-purple-600';
      case 'livre': return 'text-orange-600';
      case 'connexion': return 'text-gray-600';
      default: return 'text-black';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-100 min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="bg-neutral-100 min-h-screen flex flex-col">
        <AppHeader
          onLogoClick={() => onNavigate('editeur-accueil')}
          showUserInfo={true}
        />
        <EmptyState message="Ressource introuvable" />
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen flex flex-col">
      <AppHeader
        onLogoClick={() => onNavigate('editeur-accueil')}
        showUserInfo={true}
        onUserClick={() => onNavigate('profil')}
      />

      {/* Section titre et bouton retour */}
      <div className="px-6 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <BackButton onClick={() => onNavigate('editeur-accueil')} />

        <h2 className="font-poppins font-bold text-2xl md:text-[36px] text-blue-400 leading-[1.5]">
          Historique - {getResourceTitle()}
        </h2>
      </div>

      {/* Carte de la ressource */}
      <div className="px-6 md:px-8 lg:px-[175px] py-6">
        <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image de la ressource */}
            <div className="flex-shrink-0">
              <img
                src={resource.cover || resource.image || resource.avatar}
                alt={resource.title || resource.name}
                className="w-full md:w-[200px] h-[250px] object-cover rounded-[15px] border border-gray-200"
              />
            </div>

            {/* Informations détaillées */}
            <div className="flex-1 space-y-4">
              <h3 className="font-poppins font-bold text-2xl md:text-3xl text-black">
                {resource.title || resource.name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resourceType === 'book' && (
                  <>
                    <div>
                      <p className="font-poppins text-sm text-gray-500">Auteur</p>
                      <p className="font-poppins font-bold text-lg text-black">{resource.auteur}</p>
                    </div>
                    <div>
                      <p className="font-poppins text-sm text-gray-500">Pages</p>
                      <p className="font-poppins font-bold text-lg text-black">{resource.pages}</p>
                    </div>
                    <div>
                      <p className="font-poppins text-sm text-gray-500">Collections</p>
                      <p className="font-poppins font-bold text-lg text-black">{resource.collections}</p>
                    </div>
                    <div>
                      <p className="font-poppins text-sm text-gray-500">Lectures</p>
                      <p className="font-poppins font-bold text-lg text-black">{resource.lectures}</p>
                    </div>
                  </>
                )}

                {resourceType === 'collection' && (
                  <>
                    <div>
                      <p className="font-poppins text-sm text-gray-500">Description</p>
                      <p className="font-poppins font-bold text-lg text-black">{resource.description}</p>
                    </div>
                    <div>
                      <p className="font-poppins text-sm text-gray-500">Livres</p>
                      <p className="font-poppins font-bold text-lg text-black">{resource.livres}</p>
                    </div>
                    <div>
                      <p className="font-poppins text-sm text-gray-500">Lectures totales</p>
                      <p className="font-poppins font-bold text-lg text-black">{resource.lectures}</p>
                    </div>
                  </>
                )}

                {resourceType === 'user' && (
                  <>
                    <div>
                      <p className="font-poppins text-sm text-gray-500">Email</p>
                      <p className="font-poppins font-bold text-lg text-black">{resource.email}</p>
                    </div>
                    <div>
                      <p className="font-poppins text-sm text-gray-500">Rôle</p>
                      <p className="font-poppins font-bold text-lg text-black">{resource.role}</p>
                    </div>
                  </>
                )}

                <div>
                  <p className="font-poppins text-sm text-gray-500">Date de création</p>
                  <p className="font-poppins font-bold text-lg text-black">
                    {resource.dateCreation || resource.dateInscription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des logs */}
      <div className="flex-1 px-6 md:px-8 lg:px-[175px] py-6 mb-20">
        <div className="bg-white rounded-[20px] p-6 md:p-8 shadow-lg">
          <h3 className="font-poppins font-bold text-xl md:text-2xl text-black mb-6">
            Historique des activités
          </h3>

          {resource.logs && resource.logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-poppins font-bold text-sm md:text-base text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-poppins font-bold text-sm md:text-base text-gray-700">
                      Action
                    </th>
                    <th className="text-left py-3 px-4 font-poppins font-bold text-sm md:text-base text-gray-700">
                      Description
                    </th>
                    {resource.logs.some(log => log.auteur) && (
                      <th className="text-left py-3 px-4 font-poppins font-bold text-sm md:text-base text-gray-700">
                        Auteur
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {resource.logs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-poppins text-sm md:text-base text-gray-600">
                        {log.date}
                      </td>
                      <td className={`py-4 px-4 font-poppins font-bold text-sm md:text-base ${getLogTypeColor(log.type)}`}>
                        {log.action}
                      </td>
                      <td className="py-4 px-4 font-poppins text-sm md:text-base text-gray-800">
                        {log.description}
                      </td>
                      {log.auteur && (
                        <td className="py-4 px-4 font-poppins text-sm md:text-base text-gray-600">
                          {log.auteur}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message="Aucune activité enregistrée" />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
