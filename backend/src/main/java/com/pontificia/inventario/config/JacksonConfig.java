package com.pontificia.inventario.config;

import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configura Jackson para poder convertir a JSON las entidades de Hibernate
 * que tienen relaciones (@ManyToOne, @OneToMany, etc.) cargadas de forma
 * perezosa (FetchType.LAZY). Sin este modulo, el backend responde con un
 * error 500 al intentar serializar el "proxy" que genera Hibernate para
 * esas relaciones.
 */
@Configuration
public class JacksonConfig {

    @Bean
    public Hibernate6Module hibernate6Module() {
        Hibernate6Module module = new Hibernate6Module();
        // En vez de fallar, serializa la relacion aunque no este cargada
        // (evita el error de "no serializer found for ByteBuddyInterceptor").
        module.disable(Hibernate6Module.Feature.USE_TRANSIENT_ANNOTATION);
        return module;
    }
}
