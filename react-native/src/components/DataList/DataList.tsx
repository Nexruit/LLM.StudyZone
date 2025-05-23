import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useTheme, Searchbar, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import PropTypes from 'prop-types';
import i18n from 'i18n-js';

import { StyleSheet, View } from 'react-native';
import { debounce } from '../../utils/Debounce';
import { connectToRedux } from '../../utils/ReduxConnect';
import LoadingButton from '../LoadingButton/LoadingButton';
import NoRecordSvg from '../Common/NoRecordSvg';

function DataList({
  navigation,
  fetchFn,
  render,
  maxResultCount = 5,
  debounceTime = 350,
  trigger,
  ...props
}) {
  const [records, setRecords] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [skipCount, setSkipCount] = useState(0);
  const [filter, setFilter] = useState('');

  const theme = useTheme();

  const fetch = (skip = 0, isRefreshingActive = true) => {
    if (isRefreshingActive) setLoading(true);
    return fetchFn({ filter: !!filter ? filter : null, maxResultCount, skipCount: skip })
      .then(({ items, totalCount: total }) => {
        setTotalCount(total);
        setRecords(skip ? [...records, ...items] : items);
        setSkipCount(skip);
      })
      .finally(() => {
        if (isRefreshingActive) setLoading(false);
      });
  };

  const fetchPartial = () => {
    if (loading || records.length === totalCount) return;

    setButtonLoading(true);
    fetch(skipCount + maxResultCount, false).finally(() => setButtonLoading(false));
  };

  useFocusEffect(
    useCallback(() => {
      setFilter('');
      setSkipCount(0);
      fetch(0, false);
    }, []),
  );

  useEffect(() => {
    if (!trigger) return;

    setSkipCount(0);
    fetch(0, false);
  }, [trigger]);

  useEffect(() => {
    function searchFetch() {
      return fetch(0, false);
    }
    debounce(searchFetch, debounceTime)();
  }, [filter]);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={i18n.t('AbpUi::Search')}
        value={filter}
        onChangeText={setFilter}
        style={{
          ...styles.searchbar,
          backgroundColor: theme.colors.primaryContainer,
        }}
      />

      {records.length < 1 && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <NoRecordSvg />
        </View>
      )}

      <FlatList
        {...props}
        data={records}
        keyExtractor={item => item.id}
        renderItem={(...args) => (
          <>
            {render(...args)}
            {args[0].index + 1 === skipCount + maxResultCount && totalCount > records.length ? (
              <LoadingButton loading={buttonLoading} onPress={() => fetchPartial()}>
                <Text>{i18n.t('AbpUi::LoadMore')}</Text>
              </LoadingButton>
            ) : null}
          </>
        )}
      />
    </View>
  );
}

DataList.propTypes = {
  // ...FlatList.propTypes,
  fetchFn: PropTypes.func.isRequired,
  render: PropTypes.func.isRequired,
  maxResultCount: PropTypes.number,
  debounceTime: PropTypes.number,
};

const styles = StyleSheet.create({
  searchbar: {
    borderRadius: 10,
    marginLeft: 4,
    marginRight: 10,
    marginBottom: 16,
  },
  container: {
    paddingTop: 16,
    paddingLeft: 10,
  },
  list: {},
});

const Forwarded = forwardRef((props, ref) => <DataList {...props} forwardedRef={ref} />);

export default connectToRedux({
  component: Forwarded,
});
