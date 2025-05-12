import AdminLayout from '../../Layouts/AdminLayout';

import HomeStats from '../../Components/Manager/HomeStats';

function App() {
    return (
        <AdminLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mt-4 grid grid-cols-12 gap-4 md:mt-4 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                    <div className="col-span-12">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-2xl font-bold">Seja bem-vindo(a)!</h2>
                        </div>
                        
                        <HomeStats />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default App;