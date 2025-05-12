import AdminLayout from '../../Layouts/AdminLayout';

import MemberList from '../../Components/Manager/MemberList';

function App() {
    return (
        <AdminLayout>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <div className="mt-4 grid grid-cols-12 gap-4 md:mt-4 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                    <div className="col-span-12">
                        <MemberList />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default App;