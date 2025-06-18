import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import { TokenProvider } from './Components/TokenContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import Login from './pages/Login/Index';
import Politica from './pages/Politica/Index';
import Password from './pages/Password';
import Home from './pages/Home/Index';

import AdminLogin from './pages/Manager/Login';
import AdminHome from './pages/Manager/Home';

import AdminProducts from './pages/Manager/Products';
import AdminAddProduct from './pages/Manager/AddProduct';
import AdminEditProduct from './pages/Manager/EditProduct';

import AdminDoubts from './pages/Manager/Doubts';
import AdminAddDoubt from './pages/Manager/AddDoubt';
import AdminEditDoubt from './pages/Manager/EditDoubt';

import AdminRules from './pages/Manager/Rules';

import AdminMembers from './pages/Manager/Members';
import AdminViewMember from './pages/Manager/ViewMember';

import AdminReports from './pages/Manager/Reports';

import DefaultLayout from './Layouts/DefaultLayout';
import Ganhadores from './pages/Ganhadores/Index';
import Duvidas from './pages/Duvidas/Index';
import Regulamento from './pages/Regulamento/Index';

import Compras from './pages/Compras/Index';
import SegundaEtapa from './pages/SegundaEtapa/Index';
import TerceiraEtapa from './pages/TerceiraEtapa/Index';
import BodyClassDefault from './BodyClassDefault';
import Contato from './pages/Contato/Index';
import { ParallaxProvider } from './Components/ParallaxContext';

const App = () => {
    return (
        <TokenProvider>
            <ParallaxProvider>
                <ToastContainer />
                <Router>
                    <BodyClassDefault />
                    <Routes>
                        {/* <Route path="/promocao/manager/login" element={<AdminLogin />} /> */}
                        <Route
                            path="/promocao/alterar-senha/:token"
                            element={
                                <DefaultLayout>
                                    <Password />
                                </DefaultLayout>
                            }
                        />

                        <Route
                            path="/promocao/"
                            element={
                                <DefaultLayout>
                                    <Home />
                                </DefaultLayout>
                            }
                        />

                        <Route
                            path="/promocao/login"
                            element={
                                <DefaultLayout>
                                    <Login />
                                </DefaultLayout>
                            }
                        />

                        <Route
                            path="/promocao/fale-conosco"
                            element={
                                <DefaultLayout>
                                    <Contato />
                                </DefaultLayout>
                            }
                        />

                        <Route
                            path="/promocao/politica-privacidade"
                            element={
                                <DefaultLayout>
                                    <Politica />
                                </DefaultLayout>
                            }
                        />

                        <Route
                            path="/promocao/compras"
                            element={
                                <ProtectedRoute type="participante" element={
                                    <DefaultLayout>
                                        <Compras />
                                    </DefaultLayout>
                                } />
                            }
                        />

                        <Route
                            path="/promocao/etapa-2"
                            element={
                                <ProtectedRoute type="participante" element={
                                    <DefaultLayout>
                                        <SegundaEtapa />
                                    </DefaultLayout>
                                } />
                            }
                        />

                        <Route
                            path="/promocao/cadastro/finalizar"
                            element={
                                <ProtectedRoute type="participante" element={
                                    <DefaultLayout>
                                        <TerceiraEtapa />
                                    </DefaultLayout>
                                } />
                            }
                        />

                        <Route
                            path="/promocao/ganhadores"
                            element={
                                <DefaultLayout>
                                    <Ganhadores />
                                </DefaultLayout>
                            }
                        />

                        <Route
                            path="/promocao/duvidas"
                            element={
                                <DefaultLayout>
                                    <Duvidas />
                                </DefaultLayout>
                            }
                        />

                        <Route
                            path="/promocao/regulamento"
                            element={
                                <DefaultLayout>
                                    <Regulamento />
                                </DefaultLayout>
                            }
                        />

                        {/* Manager */}
                        <Route path="/promocao/manager" element={<ProtectedRoute type="administrador" element={<AdminHome />} />} />

                        <Route path="/promocao/manager/produtos" element={<ProtectedRoute type="administrador" element={<AdminProducts />} />} />
                        <Route path="/promocao/manager/produtos/adicionar" element={<ProtectedRoute type="administrador" element={<AdminAddProduct />} />} />
                        <Route path="/promocao/manager/produtos/editar/:id" element={<ProtectedRoute type="administrador" element={<AdminEditProduct />} />} />

                        <Route path="/promocao/manager/duvidas" element={<ProtectedRoute type="administrador" element={<AdminDoubts />} />} />
                        <Route path="/promocao/manager/duvidas/adicionar" element={<ProtectedRoute type="administrador" element={<AdminAddDoubt />} />} />
                        <Route path="/promocao/manager/duvidas/editar/:id" element={<ProtectedRoute type="administrador" element={<AdminEditDoubt />} />} />

                        <Route path="/promocao/manager/regulamento" element={<ProtectedRoute type="administrador" element={<AdminRules />} />} />

                        <Route path="/promocao/manager/participantes" element={<ProtectedRoute type="administrador" element={<AdminMembers />} />} />
                        <Route path="/promocao/manager/participantes/visualizar/:id" element={<ProtectedRoute type="administrador" element={<AdminViewMember />} />} />

                        <Route path="/promocao/manager/relatorios" element={<ProtectedRoute type="administrador" element={<AdminReports />} />} />
                    </Routes>
                </Router>
            </ParallaxProvider>

        </TokenProvider>
    );
};

export default App;