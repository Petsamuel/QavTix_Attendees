interface Group {
    id: string;
    name: string;
    members: AuthUser[];
    contributionSplit: number;
}