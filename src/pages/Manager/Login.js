import AdminAuthLayout from '../../Layouts/AdminAuthLayout';

import FormLogin from '../../Components/Manager/FormLogin';

function App() {
    return (
        <AdminAuthLayout>
            <div className="mx-auto w-full max-w-[480px]">
                <div className="text-center">
                    <div
                        className="mx-auto mb-10 inline-flex"
                    >
                        <img
                            src={`/promocao/assets/img/admin/logo.png`}
                            alt="logo"
                            className="block w-[210px]"
                        />
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-14 lg:p-5 xl:p-8">
                        <span className="mb-1 block text-slate-500 font-medium">Login</span>

                        <h2 className="mb-9 text-3xl font-bold text-black">Área Restrita</h2>

                        <FormLogin />
                    </div>
                </div>
            </div>
        </AdminAuthLayout>
    );
}

export default App;