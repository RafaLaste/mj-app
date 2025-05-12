import AdminLayout from '../../Layouts/AdminLayout';

import FormEditProduct from '../../Components/Manager/FormEditProduct';

function App() {
    return (
        <AdminLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mt-4 grid grid-cols-12 gap-4 md:mt-4 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                    <div className="col-span-12">
                        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow sm:px-7.5 xl:pb-1">
                            <FormEditProduct />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default App;