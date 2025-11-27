import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet, Text,
    TextInput, TouchableOpacity,
    View
} from 'react-native';

// --- CORES E ESTILOS GERAIS (Baseado nas imagens) ---
const COLORS = {
  primary: '#5cb85c', // Verde principal
  background: '#e8f5e9', // Fundo verde claro
  white: '#ffffff',
  text: '#333333',
  gray: '#888',
  lightGray: '#ddd'
};

// --- DADOS MOCKADOS (Promoções - Tela 4) ---
const PROMOCOES = [
  { id: '1', nome: 'Arroz tipo 1 - 5kg', mercado: 'Mercado A', preco: 'R$25,00', img: 'nutrition' },
  { id: '2', nome: 'Oleo de soja 1 - 1l', mercado: 'Mercado C', preco: 'R$6,00', img: 'water' },
  { id: '3', nome: 'Vinagre Álcool - 1l', mercado: 'Mercado B', preco: 'R$6,00', img: 'flask' },
  { id: '4', nome: 'Leite Integral - 1l', mercado: 'Mercado A', preco: 'R$ 3,99', img: 'pint' },
];

// --- TELAS ---

// 1. TELA DE LOGIN (Tela 1)
function LoginScreen({ navigation }) {
  return (
    <View style={styles.containerCenter}>
      <View style={styles.logoContainer}>
        <Ionicons name="cart" size={60} color={COLORS.primary} />
        <Text style={styles.logoText}>LISTA FÁCIL</Text>
      </View>
      
      <View style={styles.card}>
        <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
        <TextInput placeholder="Senha" style={styles.input} secureTextEntry />
        
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.replace('MainTabs')}>
          <Text style={styles.btnText}>ENTRAR</Text>
        </TouchableOpacity>
        
        <View style={styles.footerLogin}>
          <Text style={styles.linkText}>Esqueci minha senha</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkTextBold}>Não tem conta? <Text style={{color: COLORS.primary}}>Cadastre-se</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// 2. TELA DE CADASTRO (Tela 2)
function RegisterScreen({ navigation }) {
  return (
    <View style={styles.containerCenter}>
      <Ionicons name="cart" size={50} color={COLORS.white} style={{marginBottom: 20}} />
      <View style={styles.card}>
        <Text style={styles.headerText}>Cadastre-se</Text>
        <TextInput placeholder="Nome" style={styles.input} />
        <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
        <TextInput placeholder="Senha" style={styles.input} secureTextEntry />
        
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Cadastrar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 15, alignSelf: 'center'}}>
          <Text style={styles.linkText}>Já tem conta? Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 3. TELA DE LISTAS + MODAL (Tela 3 e 5)
function ListasScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState([]); // Lista vazia inicial
  const [novoItem, setNovoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const adicionarItem = () => {
    if (novoItem.trim()) {
      setItems([...items, { id: Date.now().toString(), nome: novoItem, qtd: quantidade || '1' }]);
      setNovoItem('');
      setQuantidade('');
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.containerInfo}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Listas</Text>
      </View>

      {items.length === 0 ? (
        // Estado Vazio (Tela 3)
        <View style={styles.emptyState}>
          <Ionicons name="cart-outline" size={80} color={COLORS.primary} />
          <Text style={styles.emptyText}>Você ainda não tem nenhuma lista</Text>
          <Text style={styles.emptySubText}>Crie sua primeira lista para começar</Text>
        </View>
      ) : (
        // Lista com itens
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.itemText}>{item.nome}</Text>
              <Text style={styles.qtdText}>Qtd: {item.qtd}</Text>
            </View>
          )}
          contentContainerStyle={{padding: 20}}
        />
      )}

      {/* Botão Flutuante (+ para abrir Modal) */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* MODAL DE ADICIONAR (Tela 5) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Novo Item</Text>
            
            <View style={styles.inputIconContainer}>
               <Ionicons name="clipboard-outline" size={20} color={COLORS.primary} style={{marginRight: 10}}/>
               <TextInput 
                  placeholder="Nome do Item:" 
                  style={styles.modalInput} 
                  value={novoItem}
                  onChangeText={setNovoItem}
               />
            </View>

            <View style={styles.inputIconContainer}>
               <Ionicons name="cart-outline" size={20} color={COLORS.primary} style={{marginRight: 10}}/>
               <TextInput 
                  placeholder="Quantidade:" 
                  style={styles.modalInput} 
                  value={quantidade}
                  onChangeText={setQuantidade}
                  keyboardType="numeric"
               />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btnModal, {backgroundColor: '#ccc'}]} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnTextBlack}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnModal} onPress={adicionarItem}>
                <Text style={styles.btnText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// 4. TELA DE PROMOÇÕES (Tela 4)
function PromocoesScreen() {
  return (
    <SafeAreaView style={styles.containerInfo}>
      <View style={styles.headerBack}>
        <Ionicons name="chevron-back" size={24} color="#000" />
        <Text style={styles.headerTitleInline}>Promoções de Hoje</Text>
      </View>
      <FlatList
        data={PROMOCOES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.promoCard}>
             <View style={styles.promoIcon}>
                <Ionicons name={item.img} size={30} color={COLORS.primary} /> 
             </View>
             <View style={{flex: 1}}>
                <Text style={styles.promoTitle}>{item.nome}</Text>
                <Text style={styles.promoMarket}>{item.mercado}</Text>
                <Text style={styles.promoPrice}>{item.preco}</Text>
             </View>
          </View>
        )}
        contentContainerStyle={{padding: 15}}
      />
    </SafeAreaView>
  );
}

// 5. TELA DE PERFIL (Tela 6)
function PerfilScreen({ navigation }) {
  const menuItems = [
    { title: 'Alterar Senha', icon: 'lock-closed-outline' },
    { title: 'Notificações', icon: 'notifications-outline' },
    { title: 'Informações', icon: 'information-circle-outline' },
    { title: 'Listas Salvas', icon: 'list-outline' },
  ];

  return (
    <SafeAreaView style={styles.containerInfo}>
      <View style={styles.profileHeader}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>
      
      <View style={styles.profileCard}>
        <View style={styles.avatarPlaceholder} />
        <View>
          <Text style={styles.profileName}>Gustavo Iensue</Text>
          <Text style={styles.profileEmail}>g...e@email.com</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Ionicons name={item.icon} size={20} color="#666" style={{marginRight: 10}} />
            <Text style={styles.menuText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" style={{marginLeft: 'auto'}} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.btnLogout} onPress={() => navigation.replace('Auth')}>
        <Text style={styles.btnText}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// 6. TELA MAPA (Placeholder para a Tab Bar)
function MapaScreen() {
  return (
    <View style={styles.containerCenter}>
      <Text>Mapa (Em desenvolvimento)</Text>
    </View>
  );
}

// --- NAVEGAÇÃO ---
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Listas') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Promoções') iconName = focused ? 'star' : 'star-outline';
          else if (route.name === 'Mapa') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Listas" component={ListasScreen} />
      <Tab.Screen name="Promoções" component={PromocoesScreen} />
      <Tab.Screen name="Mapa" component={MapaScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- ESTILOS CSS-IN-JS ---
const styles = StyleSheet.create({
  // Containers
  containerCenter: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  containerInfo: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Login/Register
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginTop: 10 },
  card: {
    backgroundColor: COLORS.white,
    width: '100%',
    padding: 20,
    borderRadius: 15,
    elevation: 3, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerText: { fontSize: 22, fontWeight: 'bold', color: 'green', textAlign: 'center', marginBottom: 20 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    marginBottom: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  btnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  linkText: { textAlign: 'center', color: '#888', marginTop: 15 },
  linkTextBold: { textAlign: 'center', color: '#888', fontWeight: 'bold' },
  footerLogin: { marginTop: 10 },

  // Listas
  header: { alignItems: 'center', marginTop: 20, marginBottom: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'darkgreen' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontWeight: 'bold', color: 'darkgreen', fontSize: 16, marginTop: 10 },
  emptySubText: { color: 'green', marginTop: 5 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  listItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: { fontSize: 16, fontWeight: 'bold' },
  qtdText: { color: COLORS.gray },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', width: '85%', padding: 20, borderRadius: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: 'darkgreen', textAlign: 'center', marginBottom: 20 },
  inputIconContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee', marginBottom: 15 },
  modalInput: { flex: 1, paddingVertical: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  btnModal: { flex: 1, padding: 12, borderRadius: 20, alignItems: 'center', marginHorizontal: 5, backgroundColor: COLORS.primary },
  btnTextBlack: { color: '#333', fontWeight: 'bold' },

  // Promoções
  headerBack: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#dcedc8' },
  headerTitleInline: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: 'darkgreen' },
  promoCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 10, alignItems: 'center' },
  promoIcon: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  promoTitle: { fontWeight: 'bold', fontSize: 16 },
  promoMarket: { color: '#888', fontSize: 12 },
  promoPrice: { fontWeight: 'bold', marginTop: 5 },

  // Perfil
  profileHeader: { alignItems: 'center', paddingVertical: 20 },
  profileCard: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', margin: 20, padding: 20, borderRadius: 15 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ccc', marginRight: 15 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: 'darkgreen' },
  profileEmail: { color: '#888' },
  menuContainer: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 15 },
  menuItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', alignItems: 'center' },
  menuText: { color: '#888', fontSize: 16 },
  btnLogout: { backgroundColor: 'darkgreen', margin: 20, padding: 15, borderRadius: 25, alignItems: 'center' },
});