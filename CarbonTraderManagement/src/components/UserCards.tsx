import Link from 'next/link';

export default function UserCards(p:{users: UserInfo[]}) {
  return (
      <section>
        {/* Container */}
        <div className="mx-auto w-full max-w-5xl px-5 py-3">
          {/* Title */}
          <h2 className="text-center text-3xl font-bold md:text-5xl">Review All Companies</h2>
          {/* Content */}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
            {/* Item */}
            {p.users.map((user) => (
              <Link key={user.id} className="grid gap-4 rounded-md border border-solid border-gray-300 p-8 md:p-10 hover:border-blue-500" href={`/profile/${user.public_key}`}>
                <p className="text-xl font-semibold">{(JSON.parse(user.company_msg) as CompanyInfo).companyName}</p>
                <p className="text-sm text-gray-500">EmissionData: {(JSON.parse(user.company_msg) as CompanyInfo).emissionData}</p>
                <p className="text-sm text-gray-500">ReductionStrategy: {(JSON.parse(user.company_msg) as CompanyInfo).reductionStrategy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
  );
}
