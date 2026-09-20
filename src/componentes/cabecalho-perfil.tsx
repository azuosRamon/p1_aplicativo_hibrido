import { CoresInstagram, RaiosBorda, Tipografia } from "@/constantes/sistema-design";
import { Usuario } from "@/modelos/usuario";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface PropsCabecalhoPerfil {
    usuario: Usuario;
    aoPressionarEditar?: () => void;
    aoPressionarCompartilhar?: () => void;
}

export function CabecalhoPerfil({
    usuario,
    aoPressionarEditar,
    aoPressionarCompartilhar,
}: PropsCabecalhoPerfil) {
    const navegador = useRouter();

    function abrirConfiguracoes() {
        navegador.push("/configuracoes");
    }

    return (
        <View style={estilos.conteiner}>
            {/* Barra de Topo do Perfil */}
            <View style={estilos.barraTopo}>
                <TouchableOpacity style={estilos.botaoIcone} activeOpacity={0.7}>
                    <Ionicons name="add" size={28} color={CoresInstagram.textoPrimario} />
                </TouchableOpacity>

                <TouchableOpacity style={estilos.seletorUsuario} activeOpacity={0.8}>
                    <Text style={estilos.nomeUsuarioTopo}>{usuario.nomeUsuario}</Text>
                    <Ionicons name="chevron-down" size={14} color={CoresInstagram.textoPrimario} />
                    <View style={estilos.pontoVermelhoTopo} />
                </TouchableOpacity>

                <View style={estilos.acoesTopoDireita}>
                    <TouchableOpacity style={estilos.botaoThreads} activeOpacity={0.7}>
                        <Text style={estilos.textoThreads}>@</Text>
                        <View style={estilos.badgeThreads}>
                            <Text style={estilos.textoBadgeThreads}>3</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={abrirConfiguracoes}
                        style={estilos.botaoIcone}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="menu-outline" size={28} color={CoresInstagram.textoPrimario} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Linha de Foto com Balão de Nota e Contadores */}
            <View style={estilos.linhaFotoEMetricas}>
                {/* Foto de Perfil com Balão de Nota */}
                <View style={estilos.blocoAvatar}>
                    <View style={estilos.balaoNotaPerfil}>
                        <Text style={estilos.textoBalaoNota} numberOfLines={1}>
                            {usuario.nota?.texto ?? "Deixe este espaço co..."}
                        </Text>
                    </View>
                    <View style={estilos.avatarWrapper}>
                        <Image source={{ uri: usuario.fotoUrl }} style={estilos.avatar} />
                        <TouchableOpacity style={estilos.badgeAdicionarStory} activeOpacity={0.8}>
                            <Ionicons name="add" size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Métricas: Posts, Seguidores, Seguindo */}
                <View style={estilos.metricasConteiner}>
                    <View style={estilos.colunaMetrica}>
                        <Text style={Tipografia.contadorNumero}>{usuario.totalPublicacoes}</Text>
                        <Text style={Tipografia.contadorRotulo}>posts</Text>
                    </View>
                    <View style={estilos.colunaMetrica}>
                        <Text style={Tipografia.contadorNumero}>{usuario.totalSeguidores}</Text>
                        <Text style={Tipografia.contadorRotulo}>seguidores</Text>
                    </View>
                    <View style={estilos.colunaMetrica}>
                        <Text style={Tipografia.contadorNumero}>{usuario.totalSeguindo}</Text>
                        <Text style={Tipografia.contadorRotulo}>seguindo</Text>
                    </View>
                </View>
            </View>

            {/* Biografia e Informações Pessoais */}
            <View style={estilos.secaoBio}>
                <Text style={estilos.nomeCompleto}>{usuario.nomeCompleto}</Text>
                {usuario.profissao && <Text style={estilos.linhaInfo}>{usuario.profissao}</Text>}
                {usuario.cidade && <Text style={estilos.linhaInfo}>{usuario.cidade}</Text>}
                {usuario.ano && <Text style={estilos.linhaInfo}>{usuario.ano}</Text>}
                <Text style={estilos.linkMencao}>@{usuario.nomeUsuario}.app</Text>

                {/* Pílulas de Links */}
                <View style={estilos.linhaPilulasLinks}>
                    <View style={estilos.pilulaLink}>
                        <Feather name="at-sign" size={12} color={CoresInstagram.textoPrimario} />
                        <Text style={estilos.textoPilulaLink}>{usuario.nomeUsuario}</Text>
                    </View>
                    <TouchableOpacity style={estilos.pilulaAdicionar} activeOpacity={0.7}>
                        <Ionicons name="add" size={14} color={CoresInstagram.textoPrimario} />
                        <Text style={estilos.textoPilulaLink}>Adicionar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Card "Seu painel" */}
            <TouchableOpacity style={estilos.cardPainel} activeOpacity={0.75}>
                <Text style={estilos.tituloPainel}>Seu painel</Text>
                <Text style={estilos.subtituloPainel}>
                    <Feather name="trending-up" size={13} color={CoresInstagram.verdeOnline} />{" "}
                    {usuario.visualizacoesPainel ?? 344} visualizações nos últimos 30 dias.
                </Text>
            </TouchableOpacity>

            {/* Botões de Ação do Perfil (Editar, Compartilhar, Sugestão) */}
            <View style={estilos.linhaBotoesAcao}>
                <TouchableOpacity
                    onPress={aoPressionarEditar}
                    style={estilos.botaoAcaoPrincipal}
                    activeOpacity={0.7}
                >
                    <Text style={estilos.textoBotaoAcao}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={aoPressionarCompartilhar}
                    style={estilos.botaoAcaoPrincipal}
                    activeOpacity={0.7}
                >
                    <Text style={estilos.textoBotaoAcao}>Compartilhar perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilos.botaoAcaoIcone} activeOpacity={0.7}>
                    <Ionicons name="person-add-outline" size={18} color={CoresInstagram.textoPrimario} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    conteiner: {
        backgroundColor: CoresInstagram.fundo,
        paddingBottom: 8,
    },
    barraTopo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    botaoIcone: {
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
    },
    seletorUsuario: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    nomeUsuarioTopo: {
        ...Tipografia.tituloMedio,
        fontSize: 20,
    },
    pontoVermelhoTopo: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: CoresInstagram.vermelhoNotificacao,
    },
    acoesTopoDireita: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },
    botaoThreads: {
        position: "relative",
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: CoresInstagram.textoPrimario,
        alignItems: "center",
        justifyContent: "center",
    },
    textoThreads: {
        color: CoresInstagram.textoPrimario,
        fontSize: 14,
        fontWeight: "700",
    },
    badgeThreads: {
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: CoresInstagram.vermelhoNotificacao,
        width: 14,
        height: 14,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
    },
    textoBadgeThreads: {
        color: "#FFFFFF",
        fontSize: 9,
        fontWeight: "700",
    },
    linhaFotoEMetricas: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginTop: 8,
    },
    blocoAvatar: {
        alignItems: "center",
        position: "relative",
    },
    balaoNotaPerfil: {
        backgroundColor: CoresInstagram.fundoEntrada,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        marginBottom: 6,
        borderWidth: 0.5,
        borderColor: CoresInstagram.bordaSuave,
    },
    textoBalaoNota: {
        color: CoresInstagram.textoSecundario,
        fontSize: 10,
    },
    avatarWrapper: {
        position: "relative",
    },
    avatar: {
        width: 82,
        height: 82,
        borderRadius: 41,
        backgroundColor: CoresInstagram.fundoSecundario,
    },
    badgeAdicionarStory: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: CoresInstagram.azulInstagram,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: CoresInstagram.fundo,
    },
    metricasConteiner: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        marginLeft: 16,
    },
    colunaMetrica: {
        alignItems: "center",
    },
    secaoBio: {
        paddingHorizontal: 16,
        marginTop: 12,
    },
    nomeCompleto: {
        ...Tipografia.nomeUsuario,
        fontSize: 15,
        marginBottom: 2,
    },
    linhaInfo: {
        ...Tipografia.subtitulo,
        color: CoresInstagram.textoPrimario,
        fontSize: 13,
        lineHeight: 18,
    },
    linkMencao: {
        color: CoresInstagram.textoLink,
        fontSize: 13,
        marginTop: 2,
    },
    linhaPilulasLinks: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 8,
    },
    pilulaLink: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: CoresInstagram.fundoEntrada,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: RaiosBorda.padrao,
        gap: 4,
    },
    pilulaAdicionar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: CoresInstagram.fundoEntrada,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: RaiosBorda.padrao,
        gap: 4,
    },
    textoPilulaLink: {
        color: CoresInstagram.textoPrimario,
        fontSize: 12,
        fontWeight: "600",
    },
    cardPainel: {
        backgroundColor: CoresInstagram.fundoElevado,
        marginHorizontal: 16,
        marginTop: 12,
        padding: 12,
        borderRadius: RaiosBorda.medio,
        borderWidth: 0.5,
        borderColor: CoresInstagram.bordaSuave,
    },
    tituloPainel: {
        color: CoresInstagram.textoPrimario,
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 2,
    },
    subtituloPainel: {
        color: CoresInstagram.textoSecundario,
        fontSize: 12,
    },
    linhaBotoesAcao: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        gap: 6,
        marginTop: 12,
    },
    botaoAcaoPrincipal: {
        flex: 1,
        backgroundColor: CoresInstagram.fundoEntrada,
        paddingVertical: 8,
        borderRadius: RaiosBorda.medio,
        alignItems: "center",
        justifyContent: "center",
    },
    textoBotaoAcao: {
        color: CoresInstagram.textoPrimario,
        fontSize: 14,
        fontWeight: "600",
    },
    botaoAcaoIcone: {
        backgroundColor: CoresInstagram.fundoEntrada,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: RaiosBorda.medio,
        alignItems: "center",
        justifyContent: "center",
    },
});
