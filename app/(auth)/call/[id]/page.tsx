import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Community — DevOverflow",
};

const Page = async ({ id }: { id: String }) => {
    return (
        <div>
            <p>hello</p>
        </div>
    );
};

export default Page;
