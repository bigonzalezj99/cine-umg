import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

// Establece el elemento raíz de la aplicación para accesibilidad
Modal.setAppElement('#root');

const Peliculas = () => {
    const [peliculas, setPeliculas] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [nuevaPelicula, setNuevaPelicula] = useState({
        id: '',
        titulo: '',
        genero: '',
        duracion: '',
        clasificacion: '',
        sinopsis: '',
        anio_estreno: '',
        director_id: '',
    });
    const [archivoPortada, setArchivoPortada] = useState(null); // Estado para el archivo de portada

    useEffect(() => {
        fetchPeliculas();
    }, []);

    const fetchPeliculas = async () => {
        try {
            const response = await axios.get('/api/peliculas');
            setPeliculas(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenModal = () => {
        setIsEditMode(false);
        setModalIsOpen(true);
        setNuevaPelicula({
            id: '',
            titulo: '',
            genero: '',
            duracion: '',
            clasificacion: '',
            sinopsis: '',
            anio_estreno: '',
            director_id: '',
        });
        setArchivoPortada(null); // Limpiar archivo al abrir modal
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setArchivoPortada(null); // Limpiar el archivo de portada al cerrar
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'portada') {
            setArchivoPortada(files[0]); // Solo se permite un archivo
        } else {
            setNuevaPelicula({ ...nuevaPelicula, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(); // Usar FormData para enviar archivos

        // Agregar los campos del formulario
        formData.append('titulo', nuevaPelicula.titulo);
        formData.append('genero', nuevaPelicula.genero);
        formData.append('duracion', nuevaPelicula.duracion);
        formData.append('clasificacion', nuevaPelicula.clasificacion);
        formData.append('sinopsis', nuevaPelicula.sinopsis);
        formData.append('anio_estreno', nuevaPelicula.anio_estreno);
        formData.append('director_id', nuevaPelicula.director_id);

        // Agregar la portada si hay un archivo seleccionado
        if (archivoPortada) {
            formData.append('portada', archivoPortada);
        }

        try {
            if (isEditMode) {
                await axios.put(`/api/peliculas/${nuevaPelicula.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await axios.post('/api/peliculas', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            fetchPeliculas();
            handleCloseModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (pelicula) => {
        setIsEditMode(true);
        setNuevaPelicula(pelicula);
        setModalIsOpen(true);
        setArchivoPortada(null); // Limpiar archivo al editar
    };

    const handleDelete = async (id) => {
        await axios.delete(`/api/peliculas/${id}`);
        fetchPeliculas();
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Listado de Películas</h1>
            <button onClick={handleOpenModal} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar película
            </button>

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Título</th>
                        <th className="border px-4 py-2">Género</th>
                        <th className="border px-4 py-2">Duración</th>
                        <th className="border px-4 py-2">Clasificación</th>
                        <th className="border px-4 py-2">Sinopsis</th>
                        <th className="border px-4 py-2">Año de Estreno</th>
                        <th className="border px-4 py-2">ID Director</th>
                        <th className="border px-4 py-2">Portada</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {peliculas.map((pelicula) => (
                        <tr key={pelicula.id}>
                            <td className="border px-4 py-2">{pelicula.id}</td>
                            <td className="border px-4 py-2">{pelicula.titulo}</td>
                            <td className="border px-4 py-2">{pelicula.genero}</td>
                            <td className="border px-4 py-2">{pelicula.duracion}</td>
                            <td className="border px-4 py-2">{pelicula.clasificacion}</td>
                            <td className="border px-4 py-2">{pelicula.sinopsis}</td>
                            <td className="border px-4 py-2">{pelicula.anio_estreno}</td>
                            <td className="border px-4 py-2">{pelicula.director_id}</td>
                            <td className="border px-4 py-2">
                                {pelicula.portada && (
                                    <img src={pelicula.portada} alt={pelicula.titulo} className="w-16 h-16 object-cover" />
                                )}
                            </td>
                            <td className="border px-4 py-2 flex justify-around">
                                <button onClick={() => handleEdit(pelicula)}>
                                    <FontAwesomeIcon icon={faEdit} className="text-yellow-500 hover:text-yellow-600" />
                                </button>
                                <button onClick={() => handleDelete(pelicula.id)}>
                                    <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-600" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para Agregar/Editar Película */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                className="modal p-6 rounded-lg shadow-lg bg-white max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl w-full mx-auto h-auto max-h-[90vh] overflow-y-auto"
                overlayClassName="overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                    {isEditMode ? 'Editar Película' : 'Agregar Nueva Película'}
                </h2>
                <form onSubmit={handleSubmit}>
                    {[
                        { label: 'Título', id: 'titulo', type: 'text', required: true },
                        { label: 'Género', id: 'genero', type: 'text', required: true },
                        { label: 'Duración (min)', id: 'duracion', type: 'number', required: true },
                        { label: 'Clasificación', id: 'clasificacion', type: 'text', required: true },
                        { label: 'Sinopsis', id: 'sinopsis', type: 'textarea', rows: 4 },
                        { label: 'Año de Estreno', id: 'anio_estreno', type: 'number', required: true },
                        { label: 'ID del Director', id: 'director_id', type: 'number' },
                    ].map(({ label, id, type, rows, required }) => (
                        <div className="mb-4" key={id}>
                            <label className="block mb-1 text-gray-700 font-medium" htmlFor={id}>
                                {label}
                            </label>
                            {type === 'textarea' ? (
                                <textarea
                                    id={id}
                                    name={id}
                                    value={nuevaPelicula[id]}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                                    rows={rows}
                                />
                            ) : (
                                <input
                                    type={type}
                                    id={id}
                                    name={id}
                                    value={nuevaPelicula[id]}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                                    required={required}
                                />
                            )}
                        </div>
                    ))}
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-700 font-medium" htmlFor="portada">
                            Portada (Imagen)
                        </label>
                        <input
                            type="file"
                            id="portada"
                            name="portada"
                            accept="image/*" // Solo acepta archivos de imagen
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-200"
                    >
                        {isEditMode ? 'Actualizar' : 'Agregar'}
                    </button>
                </form>
                <button
                    onClick={handleCloseModal}
                    className="mt-4 text-red-500 hover:text-red-600 transition duration-200"
                >
                    Cerrar
                </button>
            </Modal>
        </div>
    );
};

export default Peliculas;