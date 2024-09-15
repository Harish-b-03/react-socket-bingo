import React, {
	ReactElement,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

export interface UserType {
	bingoBoard: any;
	readyToStart: boolean;
	roomId: string;
	socketId: string;
	userId: string;
	userName: string;
}

interface UserContextType {
	user: UserType | null;
	updateUser: (val: UserType) => void;
}

const UserContext = createContext<UserContextType>({
	user: null,
	updateUser: () => {},
});

const UserProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
	const [user, setUser] = useState<UserType | null>(null);
	const updateUser = (value: UserType) => {
		setUser(value);
	};

	useEffect(() => {
		console.log(user);
	}, [user]);

	return (
		<UserContext.Provider value={{ user, updateUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUserContext = () => useContext(UserContext);

export default UserProvider;
