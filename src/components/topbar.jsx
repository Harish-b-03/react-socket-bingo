const Topbar = ({ user }) => {
	return (
		<div className="px-4 py-1 text-sm flex flex-col float-right text-right text-gray-600 font-light">
			{/* <span className="-mb-1">{user.userName}</span> */}
			<span>roomId: {user.roomId}</span>
		</div>
	);
};

export default Topbar;
