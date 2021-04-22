import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/helper';
import { DataTable } from 'react-native-paper';


const Header = (props) => {

    const titolo = props.string;

    function StampaHeader() {

        if (props.data != 0) {
            if (titolo == "iC00a")
                return <DataTable.Header>
                    <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>ANNO</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>REGOLARI</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>SOSPESI</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                </DataTable.Header>

            if (titolo == 'iC00d')
                return <DataTable.Row>
                    <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>ANNO</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>REGOLARI</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>SOSPESI</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                </DataTable.Row>

            if (titolo == 'iC00e')
                return <DataTable.Row>
                    <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>ANNO</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>REGOLARI CSTD</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                </DataTable.Row>

            if (titolo == 'iC00g')
                return <DataTable.Row>
                    <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>ANNO ISCRIZIONE</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>LAUREATI IN CORSO</Text></DataTable.Title>
                </DataTable.Row>

            if (titolo == 'iC00h')
                return <DataTable.Row>
                    <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>ANNO SOLARE</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>LAUREATI TOTALI</Text></DataTable.Title>
                </DataTable.Row>

            if (titolo == 'iC01')
                return <DataTable.Row>
                    <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>A.A.</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>REGOLARI</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>%</Text></DataTable.Title>
                </DataTable.Row>

            if (titolo == 'iC02')
                return <DataTable.Row>
                   <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>A.I.</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>REGOLARI</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>%</Text></DataTable.Title>
                </DataTable.Row>
            
            if (titolo == "iC10")
                return <DataTable.Row>
                   <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>A.A.</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>CFU</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>%</Text></DataTable.Title>
                </DataTable.Row>
            
            if (titolo == "iC11")
                return <DataTable.Row>
                   <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>A.L.</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>LAUREATI</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>%</Text></DataTable.Title>
                </DataTable.Row>
            
            if (titolo == "iC12")
                return <DataTable.Row>
                   <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>A.I.</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>ESTERO</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                    <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>%</Text></DataTable.Title>
                </DataTable.Row>

            

            if (titolo == 'iC13')
            return <DataTable.Row>
               <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>ANNO ACCADEMICO</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>PERCENTUALE</Text></DataTable.Title>
            </DataTable.Row>
            if (titolo == 'iC14')
            return <DataTable.Row>
               <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>A.I.</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>CONTINUA</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>%</Text></DataTable.Title>
            </DataTable.Row>
            if (titolo == 'iC15')
            return <DataTable.Row>
               <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>A.I.</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>CONTINUA</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>%</Text></DataTable.Title>
            </DataTable.Row>
            if (titolo == 'iC16')
            return <DataTable.Row>
               <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>A.I.</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>CONTINUA</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>%</Text></DataTable.Title>
            </DataTable.Row>
            if (titolo == 'iC17')
            return <DataTable.Row>
               <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>A.I.</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>LAUREATI</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>%</Text></DataTable.Title>
            </DataTable.Row>

            if (titolo == 'iC21')
            return <DataTable.Row>
               <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>A.I.</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>CONTINUA</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>%</Text></DataTable.Title>
            </DataTable.Row>
            if (titolo == 'iC22')
            return <DataTable.Row>
               <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>A.I.</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>LAUREATI</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>%</Text></DataTable.Title>
            </DataTable.Row>
            if (titolo == "iC23")
            return <DataTable.Row>
               <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>A.I.</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>CONTINUA</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>%</Text></DataTable.Title>
            </DataTable.Row>
            if (titolo == "iC24")
            return <DataTable.Row>
               <DataTable.Title><Text style={{ fontWeight: 'bold', fontSize: 15 }}>A.I.</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>ABBANDONI</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>TOTALI</Text></DataTable.Title>
                <DataTable.Title numeric><Text style={{ fontWeight: 'bold', fontSize: 15 }}>%</Text></DataTable.Title>
            </DataTable.Row>
        }
        return null;
    }

    return (

        <StampaHeader />

    )
}

export default Header;