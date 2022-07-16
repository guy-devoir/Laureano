from ast import Try
from ssl import Options
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.keys import Keys
import time

class WebAutomaton:

    def __init__(self) -> None:
        driver_path = 'msedgedriver.exe'
        self.driver = webdriver.Edge(driver_path)

    def invoice_SAT(self, nit, fecha, cliente, direccion, productos):
        login_page = "https://farm3.sat.gob.gt/menu/login.jsp"
        fel_page = "https://farm3.sat.gob.gt/menu/Seguridad.do?opc=007032100&gui=F83038F28671148FE040640A3E3E3B42&a=AgenciaVirtual&s=237795931&url=https://farm3.sat.gob.gt/agenciaVirtual-web/pages/agenciaPortada.jsf"
        fel_link = "html/body/form/table[2]/tbody/tr[6]/td[1]/div/div[2]/ul/li[2]/a"

        fel_elements = {
            'fecha_input' : '/html/body/div/div[1]/center/div/div[2]/div/div[2]/div[1]/fieldset/div[2]/div[2]/div[1]/input',
            'nit_input' : '/html/body/div/div[1]/center/div/div[2]/div/div[2]/div[1]/fieldset/div[2]/div[9]/div[1]/div[1]/input',
            'nombre_input' : '/html/body/div/div[1]/center/div/div[2]/div/div[2]/div[1]/fieldset/div[2]/div[9]/div[2]/div/input',
            'new_item':'/html/body/div/div[1]/center/div/div[2]/div/div[2]/div[3]/fieldset/div/div/div[1]/button',
            'vista_p' : '/html/body/div/div[1]/center/div/div[3]/center/button',
            'dummy_click':'/html/body/div/div[1]/center/div/div[2]/div/div[2]/div[1]/fieldset/div[2]/div[1]/div/span/label',
            'certify_button' : '/html/body/div[3]/div/div/div[2]/center/div[2]/center/button[2]',
            'sign_input' : '/html/body/div[5]/div/div/div[2]/div[2]/div/input',
            'sign_button' : '/html/body/div[5]/div/div/div[2]/div[3]/center/button'
        }

        p_len = len(productos) 
        #Needed
        self.driver.set_window_position(2000, 0)
        self.driver.maximize_window()
        time.sleep(1)

        #A la pagina
        self.driver.get(login_page)

        wbw = WebDriverWait(self.driver, 5)
        #Login
        wbw.until(EC.element_to_be_clickable((By.NAME,'login'))).send_keys('5346916')
        wbw.until(EC.element_to_be_clickable((By.NAME,'password'))).send_keys('lauriano1')
        wbw.until(EC.element_to_be_clickable((By.CSS_SELECTOR,'input.boton_app'))).click()

        #Main Menu 
        self.driver.get(fel_page)
        self.driver.switch_to.frame(self.driver.find_elements(By.TAG_NAME, "iframe")[0])
        wbw.until(EC.element_to_be_clickable((By.XPATH, fel_link))).click()
        
        for i in range(p_len):
            dropdown = Select(wbw.until(EC.element_to_be_clickable((By.NAME, 'BienOServicio{}'.format(i)))))
            dropdown.select_by_visible_text('Bien')
            #print(wbw.until(EC.element_to_be_clickable((By.NAME, 'Cantidad{}'.format(i)))).get_attribute('value'), 'HOPE THIS FUCKING WORKS!')
            wbw.until(EC.element_to_be_clickable((By.NAME, 'Cantidad{}'.format(i)))).send_keys(Keys.BACK_SPACE)
            wbw.until(EC.element_to_be_clickable((By.NAME, 'Cantidad{}'.format(i)))).send_keys(productos[i][0])
            wbw.until(EC.element_to_be_clickable((By.NAME, 'Descripcion{}'.format(i)))).send_keys(productos[i][1])
            wbw.until(EC.element_to_be_clickable((By.NAME, 'PrecioUnitario{}'.format(i)))).send_keys(productos[i][2])
            if (i != (p_len - 1)):
                wbw.until(EC.element_to_be_clickable((By.XPATH, fel_elements['new_item']))).click()

        if (nit == ''):
            wbw.until(EC.element_to_be_clickable((By.XPATH, fel_elements['nit_input']))).send_keys('CF')
            if (cliente == ''):
                pass
            else:
                for i in range(16):
                    wbw.until(EC.element_to_be_clickable((By.XPATH, fel_elements['nombre_input']))).send_keys(Keys.BACK_SPACE)
                wbw.until(EC.element_to_be_clickable((By.XPATH, fel_elements['nombre_input']))).send_keys('Keys.BACK_SPACE')  
        else:
            wbw.until(EC.element_to_be_clickable((By.XPATH, fel_elements['nit_input']))).send_keys(nit)
        
        #Es necesario hacer click en alguna parte para que busque el nit
        wbw.until(EC.element_to_be_clickable((By.XPATH, fel_elements['dummy_click']))).click()
        time.sleep(1)
        try:
            wbw.until(EC.element_to_be_clickable((By.XPATH, fel_elements['vista_p']))).click()
            wbw.until(EC.element_to_be_clickable((By.XPATH, fel_elements['certify_button']))).click()
            #wbw.until(EC.element_to_be_clickable((By.XPATH, fel_elements['sign_input']))).send_keys()
            #wbw.until(EC.element_to_be_clickable((By.XPATH, fel_elements['sign_button']))).click()
        except:
            print('NIT no valido \nEntrada Manual')