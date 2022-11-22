import React from "react";
import StandardLayout from "../../layouts/StandardLayout";

export class TopPlaying extends React.Component {
    render() {
        return <StandardLayout>
            <iframe width="100%"
                    height={'500px'}
                       src="https://datastudio.google.com/embed/reporting/af3206e5-17b8-414b-a4dd-63be89c202d2/page/bnV8C"
                       frameBorder="0" allowFullScreen></iframe>
        </StandardLayout>
    }
}