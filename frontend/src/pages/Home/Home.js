import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import LikeContainer from "../../components/LikeContainer";
import PhotoItem from "../../components/PhotoItem";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";
import { getPhotos, like } from "../../slices/photoSlice";

const Home = () => {
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);

  // Certifique-se de que o estado de photos seja inicializado corretamente como uma array vazia.
  const { user } = useSelector((state) => state.auth);
  const { photos = [], loading } = useSelector((state) => state.photo);

  // Load all photos
  useEffect(() => {
    dispatch(getPhotos())
      .catch((error) => {
        console.error("Erro ao carregar fotos:", error);
        // Exibir mensagem de erro ao usuário
      });
  }, [dispatch]);

  const handleLike = (photo = null) => {
    dispatch(like(photo._id));
    resetMessage();
  };

  if (loading) {
    return <p>Carregando fotos...</p>;
  }

  return (
    <div id="home">
      {photos && Array.isArray(photos) && photos.length > 0 ? (
        photos.map((photo) => (
          <div key={photo._id}>
            <PhotoItem photo={photo} />
            <LikeContainer photo={photo} user={user} handleLike={handleLike} />
            <Link className="btn" to={`/photos/${photo._id}`}>
              Ver mais
            </Link>
          </div>
        ))
      ) : (
        <h2 className="no-photos">
          Ainda não há fotos publicadas,
          <Link to={`/users/${user.userId}`}>clique aqui</Link> para começar.
        </h2>
      )}
    </div>
  );
};

export default Home;
